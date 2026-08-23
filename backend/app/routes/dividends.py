# app/routes/dividends.py

from datetime import datetime, timezone

from fastapi import APIRouter, Request

from app.auth import get_current_user
from app.db import get_connection

router = APIRouter(prefix="/api/dividends", tags=["Dividends"])


@router.get("/upcoming")
def get_upcoming_dividends(request: Request, page: int = 1, page_size: int = 10):

    session = get_current_user(request)
    user_id = session["user_id"]

    if page < 1:
        page = 1

    offset = (page - 1) * page_size

    with get_connection() as conn:
        with conn.cursor() as cur:

            # Total count for pagination
            cur.execute(
                """
                SELECT COUNT(*)
                FROM dividends
                JOIN holdings ON holdings.stock_id = dividends.stock_id
                WHERE holdings.user_id = %s
                  AND holdings.quantity > 0
                  AND dividends.dividend_date > NOW()
                """,
                (user_id,),
            )
            total_count = cur.fetchone()[0]

            # This page's rows
            cur.execute(
                """
                SELECT
                    dividends.dividend_id,
                    stock.symbol,
                    dividends.dividend_amount_pershare,
                    dividends.dividend_date,
                    holdings.quantity
                FROM dividends
                JOIN stock ON stock.stock_id = dividends.stock_id
                JOIN holdings ON holdings.stock_id = dividends.stock_id
                WHERE holdings.user_id = %s
                  AND holdings.quantity > 0
                  AND dividends.dividend_date > NOW()
                ORDER BY dividends.dividend_date ASC
                LIMIT %s OFFSET %s
                """,
                (user_id, page_size, offset),
            )

            rows = cur.fetchall()

    items = []

    for dividend_id, symbol, per_share, dividend_date, quantity in rows:

        per_share = float(per_share)
        amount = per_share * quantity

        items.append({
            "id": dividend_id,
            "symbol": symbol,
            "perShare": per_share,
            "amount": amount,
            "payDate": dividend_date.strftime("%b %d, %Y"),
            "status": "upcoming",
        })

    return {
        "items": items,
        "total_count": total_count,
        "page": page,
        "page_size": page_size,
    }