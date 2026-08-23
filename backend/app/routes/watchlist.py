# app/routes/watchlist.py

from fastapi import APIRouter, Request,HTTPException
from app.auth import get_current_user
from app.db import get_connection

router = APIRouter(prefix="/api/watchlist", tags=["Watchlist"])


def get_change_pct(cur, stock_id: int, current_price: float) -> float:

    cur.execute(
        """
        SELECT price
        FROM price_history
        WHERE stock_id = %s
          AND recorded_at <= NOW() - INTERVAL '24 hours'
        ORDER BY recorded_at DESC
        LIMIT 1
        """,
        (stock_id,),
    )

    row = cur.fetchone()

    if not row:
        return 0

    old_price = float(row[0])

    if old_price == 0:
        return 0

    return ((current_price - old_price) / old_price) * 100


def get_volume(cur, stock_id: int) -> str:

    cur.execute(
        """
        SELECT COALESCE(SUM(quantity), 0)
        FROM transactions
        WHERE stock_id = %s
          AND trx_date >= NOW() - INTERVAL '24 hours'
        """,
        (stock_id,),
    )

    row = cur.fetchone()
    total = int(row[0])

    return format_volume(total)


def format_volume(total: int) -> str:

    if total >= 1_000_000:
        return f"{total / 1_000_000:.1f}M"

    if total >= 1_000:
        return f"{total / 1_000:.1f}K"

    return str(total)


def build_watchlist_response(cur, rows) -> list:

    result = []

    for stock_id, symbol, company_name, current_price in rows:

        price = float(current_price)

        result.append({
            "symbol": symbol,
            "name": company_name,
            "price": price,
            "changePct": get_change_pct(cur, stock_id, price),
            "volume": get_volume(cur, stock_id),
        })

    return result


@router.get("/recent")
def get_recent_watchlist(request: Request):

    session = get_current_user(request)
    user_id = session["user_id"]

    with get_connection() as conn:
        with conn.cursor() as cur:

            cur.execute(
                """
                SELECT
                    stock.stock_id,
                    stock.symbol,
                    company.company_name,
                    stock.current_price
                FROM wishlists
                JOIN stock ON stock.stock_id = wishlists.stock_id
                JOIN company ON company.company_id = stock.company_id
                WHERE wishlists.user_id = %s
                LIMIT 5
                """,
                (user_id,),
            )

            rows = cur.fetchall()

            return build_watchlist_response(cur, rows)


@router.get("/all")
def get_all_watchlist(request: Request):

    session = get_current_user(request)
    user_id = session["user_id"]

    with get_connection() as conn:
        with conn.cursor() as cur:

            cur.execute(
                """
                SELECT
                    stock.stock_id,
                    stock.symbol,
                    company.company_name,
                    stock.current_price
                FROM wishlists
                JOIN stock ON stock.stock_id = wishlists.stock_id
                JOIN company ON company.company_id = stock.company_id
                WHERE wishlists.user_id = %s
                """,
                (user_id,),
            )

            rows = cur.fetchall()

            return build_watchlist_response(cur, rows)





# get_change_pct — looks for the most recent price_history row that's at least 24 hours old,
#  and compares it to the live current_price. recorded_at <= NOW() - 
# INTERVAL '24 hours' means "at least a day old," and ORDER BY ... 
# DESC LIMIT 1 gets the closest one to exactly 24h ago (not older than needed).
#  Guards against old_price == 0 to avoid a divide-by-zero crash.
# get_volume — sums quantity across all transactions for that stock in the last 24 hours. 
# COALESCE(SUM(quantity), 0) handles the case where there are zero matching transactions 
# — normally SUM() on no rows returns NULL, which would crash int(row[0]); 
# COALESCE swaps that NULL for 0 safely.
# format_volume — turns a raw share count into the "42.8M" / "1.2K" style your UI expects. 
# Plain numbers under 1,000 just show as-is.
# build_watchlist_response — shared logic so /recent and /all don't duplicate the same loop; 
# both endpoints now select stock_id too (needed to run the sub-queries), 
# then hand off to this helper.




@router.delete("/{symbol}")
def remove_from_watchlist(symbol: str, request: Request):

    session = get_current_user(request)
    user_id = session["user_id"]

    with get_connection() as conn:
        with conn.cursor() as cur:

            cur.execute(
                """
                SELECT stock_id
                FROM stock
                WHERE symbol = %s
                """,
                (symbol,),
            )

            stock = cur.fetchone()

            if not stock:
                raise HTTPException(
                    status_code=404,
                    detail="Stock not found",
                )

            stock_id = stock[0]

            cur.execute(
                """
                DELETE FROM wishlists
                WHERE user_id = %s AND stock_id = %s
                """,
                (user_id, stock_id),
            )

        conn.commit()

    return {"message": "Removed from watchlist"}



@router.post("/{symbol}")
def add_to_watchlist(symbol: str, request: Request):

    session = get_current_user(request)
    user_id = session["user_id"]

    with get_connection() as conn:
        with conn.cursor() as cur:

            cur.execute(
                """
                SELECT stock_id
                FROM stock
                WHERE symbol = %s
                """,
                (symbol,),
            )

            stock = cur.fetchone()

            if not stock:
                raise HTTPException(
                    status_code=404,
                    detail="Stock not found",
                )

            stock_id = stock[0]

            cur.execute(
                """
                INSERT INTO wishlists (user_id, stock_id)
                VALUES (%s, %s)
                ON CONFLICT DO NOTHING
                """,
                (user_id, stock_id),
            )

        conn.commit()

    return {"message": "Added to watchlist"}