# app/routes/trading.py

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

from app.auth import get_current_user
from app.db import get_connection

router = APIRouter(prefix="/api/trading", tags=["Trading"])


class PlaceOrderRequest(BaseModel):
    symbol: str
    side: str  # 'buy' or 'sell'
    execution_type: str  # 'market' or 'limit'
    quantity: int
    limit_price: float | None = None


@router.post("/orders")
def place_order(data: PlaceOrderRequest, request: Request):

    session = get_current_user(request)
    user_id = session["user_id"]

    if data.side not in ("buy", "sell"):
        raise HTTPException(status_code=400, detail="side must be 'buy' or 'sell'")

    if data.execution_type not in ("market", "limit"):
        raise HTTPException(status_code=400, detail="execution_type must be 'market' or 'limit'")

    if data.quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be greater than zero")

    if data.execution_type == "limit" and (data.limit_price is None or data.limit_price <= 0):
        raise HTTPException(status_code=400, detail="limit_price is required for limit orders")

    with get_connection() as conn:
        with conn.cursor() as cur:

            # 1. Look up the stock
            cur.execute(
                "SELECT stock_id, current_price FROM stock WHERE symbol = %s",
                (data.symbol,),
            )
            stock = cur.fetchone()

            if not stock:
                raise HTTPException(status_code=404, detail="Stock not found")

            stock_id, current_price = stock
            current_price = float(current_price)

            order_price = data.limit_price if data.execution_type == "limit" else current_price

            holding_id_for_new_order = None

            # 2. Validate based on side
            if data.side == "buy":
                cur.execute("SELECT balance FROM users WHERE user_id = %s", (user_id,))
                balance = float(cur.fetchone()[0])
                estimated_cost = data.quantity * order_price

                if balance < estimated_cost:
                    raise HTTPException(status_code=400, detail="Insufficient balance")

            else:  # sell
                cur.execute(
                    "SELECT holding_id, quantity FROM holdings WHERE user_id = %s AND stock_id = %s",
                    (user_id, stock_id),
                )
                holding = cur.fetchone()

                if not holding:
                    raise HTTPException(status_code=400, detail="You do not own any shares of this stock")

                holding_id, owned_quantity = holding

                if data.quantity > owned_quantity:
                    raise HTTPException(status_code=400, detail="You do not own enough shares to sell that amount")

                holding_id_for_new_order = holding_id

            # 3. Insert the new order as pending
            cur.execute(
                """
                INSERT INTO orders (
                    user_id, stock_id, order_type, execution_type,
                    quantity, price, status, holding_id
                )
                VALUES (%s, %s, %s, %s, %s, %s, 'pending', %s)
                RETURNING order_id
                """,
                (
                    user_id, stock_id, data.side, data.execution_type,
                    data.quantity, order_price, holding_id_for_new_order,
                ),
            )
            new_order_id = cur.fetchone()[0]

            remaining = data.quantity

            # 4. Find matching candidates on the opposite side
            if data.side == "buy":
                if data.execution_type == "limit":
                    cur.execute(
                        """
                        SELECT order_id, user_id, quantity, price, holding_id
                        FROM orders
                        WHERE stock_id = %s
                          AND order_type = 'sell'
                          AND status IN ('pending', 'partially_completed')
                          AND price <= %s
                        ORDER BY price ASC, created_at ASC
                        """,
                        (stock_id, order_price),
                    )
                else:
                    cur.execute(
                        """
                        SELECT order_id, user_id, quantity, price, holding_id
                        FROM orders
                        WHERE stock_id = %s
                          AND order_type = 'sell'
                          AND status IN ('pending', 'partially_completed')
                        ORDER BY price ASC, created_at ASC
                        """,
                        (stock_id,),
                    )
            else:
                if data.execution_type == "limit":
                    cur.execute(
                        """
                        SELECT order_id, user_id, quantity, price, holding_id
                        FROM orders
                        WHERE stock_id = %s
                          AND order_type = 'buy'
                          AND status IN ('pending', 'partially_completed')
                          AND price >= %s
                        ORDER BY price DESC, created_at ASC
                        """,
                        (stock_id, order_price),
                    )
                else:
                    cur.execute(
                        """
                        SELECT order_id, user_id, quantity, price, holding_id
                        FROM orders
                        WHERE stock_id = %s
                          AND order_type = 'buy'
                          AND status IN ('pending', 'partially_completed')
                        ORDER BY price DESC, created_at ASC
                        """,
                        (stock_id,),
                    )

            candidates = cur.fetchall()

            # 5. Walk through candidates and fill
            for cand_order_id, cand_user_id, cand_qty, cand_price, cand_holding_id in candidates:

                if remaining <= 0:
                    break

                cand_price = float(cand_price)
                trade_qty = min(remaining, cand_qty)
                trade_price = cand_price  # resting order's price wins
                trade_value = trade_qty * trade_price

                if data.side == "buy":
                    buyer_id = user_id
                    seller_id = cand_user_id
                    seller_holding_id = cand_holding_id
                else:
                    buyer_id = cand_user_id
                    seller_id = user_id
                    seller_holding_id = holding_id_for_new_order

                # Update seller's holding (decrement, delete if zero)
                cur.execute(
                    "SELECT quantity FROM holdings WHERE holding_id = %s",
                    (seller_holding_id,),
                )
                seller_qty = cur.fetchone()[0]
                new_seller_qty = seller_qty - trade_qty

                # Insert the transaction FIRST (while holding still exists)
                cur.execute(
                    """
                    INSERT INTO transactions (
                        order_id, buyer_id, seller_id, stock_id,
                        quantity, price, seller_holding_id
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    """,
                    (new_order_id, buyer_id, seller_id, stock_id, trade_qty, trade_price, seller_holding_id),
                )

                if new_seller_qty == 0:
                    cur.execute("DELETE FROM holdings WHERE holding_id = %s", (seller_holding_id,))
                else:
                    cur.execute(
                        "UPDATE holdings SET quantity = %s WHERE holding_id = %s",
                        (new_seller_qty, seller_holding_id),
                    )

                # Update buyer's holding (upsert with weighted avg price)
                cur.execute(
                    "SELECT holding_id, quantity, avg_price FROM holdings WHERE user_id = %s AND stock_id = %s",
                    (buyer_id, stock_id),
                )
                buyer_hold = cur.fetchone()

                if buyer_hold:
                    b_holding_id, b_qty, b_avg = buyer_hold
                    b_avg = float(b_avg)
                    new_b_qty = b_qty + trade_qty
                    new_b_avg = ((b_qty * b_avg) + (trade_qty * trade_price)) / new_b_qty
                    cur.execute(
                        "UPDATE holdings SET quantity = %s, avg_price = %s WHERE holding_id = %s",
                        (new_b_qty, new_b_avg, b_holding_id),
                    )
                else:
                    cur.execute(
                        """
                        INSERT INTO holdings (user_id, stock_id, quantity, avg_price)
                        VALUES (%s, %s, %s, %s)
                        """,
                        (buyer_id, stock_id, trade_qty, trade_price),
                    )

                # Update balances
                cur.execute("UPDATE users SET balance = balance - %s WHERE user_id = %s", (trade_value, buyer_id))
                cur.execute("UPDATE users SET balance = balance + %s WHERE user_id = %s", (trade_value, seller_id))

                # Update the resting (candidate) order
                cand_remaining = cand_qty - trade_qty
                cand_status = "completed" if cand_remaining == 0 else "partially_completed"
                cur.execute(
                    "UPDATE orders SET quantity = %s, status = %s WHERE order_id = %s",
                    (cand_remaining, cand_status, cand_order_id),
                )

                remaining -= trade_qty

            # 6. Finalize the new order's own status
            if remaining == 0:
                final_status = "completed"
            elif remaining < data.quantity:
                final_status = "partially_completed"
            else:
                final_status = "pending"

            cur.execute(
                "UPDATE orders SET quantity = %s, status = %s WHERE order_id = %s",
                (remaining, final_status, new_order_id),
            )

        conn.commit()

    return {
        "message": "Order placed",
        "order_id": new_order_id,
        "status": final_status,
        "quantity_filled": data.quantity - remaining,
        "quantity_remaining": remaining,
    }