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
def get_all_orders(request: Request):

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