# app/routes/orders.py

from fastapi import APIRouter, Request

from app.auth import get_current_user
from app.db import get_connection

router = APIRouter(prefix="/api/orders", tags=["Orders"])


@router.get("/recent")
def get_recent_orders(request: Request):

    session = get_current_user(request)
    user_id = session["user_id"]

    with get_connection() as conn:
        with conn.cursor() as cur:

            cur.execute(
                """
                SELECT
                    orders.order_id,
                    orders.order_type,
                    stock.symbol,
                    orders.quantity,
                    orders.price,
                    orders.status,
                    orders.created_at
                FROM orders
                JOIN stock ON stock.stock_id = orders.stock_id
                WHERE orders.user_id = %s
                ORDER BY orders.created_at DESC
                LIMIT 4
                """,
                (user_id,),
            )

            rows = cur.fetchall()

    result = []

    for row in rows:
        order_id, order_type, symbol, quantity, price, status, created_at = row

        result.append({
            "id": order_id,
            "side": order_type,
            "symbol": symbol,
            "shares": quantity,
            "date": created_at.strftime("%b %d, %Y"),
            "total": float(price) * quantity,
            "status": status,
        })

    return result




@router.get("/all")
def get_all_orders(request: Request, page: int = 1, page_size: int = 10):

    session = get_current_user(request)
    user_id = session["user_id"]

    if page < 1:
        page = 1

    offset = (page - 1) * page_size

    with get_connection() as conn:
        with conn.cursor() as cur:

            # Total count, for calculating how many pages exist
            cur.execute(
                """
                SELECT COUNT(*)
                FROM orders
                WHERE user_id = %s
                """,
                (user_id,),
            )
            total_count = cur.fetchone()[0]

            # Just this page's worth of rows
            cur.execute(
                """
                SELECT
                    orders.order_id,
                    orders.order_type,
                    stock.symbol,
                    orders.quantity,
                    orders.price,
                    orders.status,
                    orders.created_at
                FROM orders
                JOIN stock ON stock.stock_id = orders.stock_id
                WHERE orders.user_id = %s
                ORDER BY orders.created_at DESC
                LIMIT %s OFFSET %s
                """,
                (user_id, page_size, offset),
            )

            rows = cur.fetchall()

    items = []

    for row in rows:
        order_id, order_type, symbol, quantity, price, status, created_at = row

        items.append({
            "id": order_id,
            "side": order_type,
            "symbol": symbol,
            "shares": quantity,
            "date": created_at.strftime("%b %d, %Y"),
            "total": float(price) * quantity,
            "status": status,
        })

    return {
        "items": items,
        "total_count": total_count,
        "page": page,
        "page_size": page_size,
    }


@router.get("/transactions")
def get_transactions(request: Request):

    session = get_current_user(request)
    user_id = session["user_id"]

    with get_connection() as conn:
        with conn.cursor() as cur:

            cur.execute(
                """
                SELECT
                    transactions.trx_id,
                    transactions.buyer_id,
                    transactions.seller_id,
                    stock.symbol,
                    transactions.quantity,
                    transactions.price,
                    transactions.trx_date
                FROM transactions
                JOIN stock ON stock.stock_id = transactions.stock_id
                WHERE transactions.buyer_id = %s OR transactions.seller_id = %s
                ORDER BY transactions.trx_date DESC
                """,
                (user_id, user_id),
            )

            rows = cur.fetchall()

    result = []

    for row in rows:
        trx_id, buyer_id, seller_id, symbol, quantity, price, trx_date = row

        is_buyer = buyer_id == user_id
        total = float(price) * quantity

        result.append({
            "id": trx_id,
            "type": "Buy" if is_buyer else "Sell",
            "description": f"{quantity} shares of {symbol}",
            "amount": -total if is_buyer else total,
            "date": trx_date.strftime("%b %d, %Y"),
            "status": "Completed",
        })

    return result