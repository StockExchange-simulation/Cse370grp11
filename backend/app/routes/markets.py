# app/routes/markets.py

from datetime import datetime, timezone

from fastapi import APIRouter,HTTPException

from app.db import get_connection

router = APIRouter(prefix="/api/markets", tags=["Markets"])


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


@router.get("/")
def get_all_markets():

    with get_connection() as conn:
        with conn.cursor() as cur:

            cur.execute(
                """
                SELECT
                    stock.stock_id,
                    stock.symbol,
                    company.company_name,
                    stock.current_price
                FROM stock
                JOIN company ON company.company_id = stock.company_id
                ORDER BY stock.symbol
                """
            )

            rows = cur.fetchall()

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
        
@router.get("/{symbol}")
def get_stock_by_symbol(symbol: str):

    with get_connection() as conn:
        with conn.cursor() as cur:

            cur.execute(
                """
                SELECT
                    stock.stock_id,
                    stock.symbol,
                    company.company_name,
                    stock.current_price
                FROM stock
                JOIN company ON company.company_id = stock.company_id
                WHERE stock.symbol = %s
                """,
                (symbol,),
            )

            row = cur.fetchone()

            if not row:
                raise HTTPException(status_code=404, detail="Stock not found")

            stock_id, symbol, company_name, current_price = row
            price = float(current_price)

            return {
                "symbol": symbol,
                "name": company_name,
                "price": price,
                "changePct": get_change_pct(cur, stock_id, price),
                "volume": get_volume(cur, stock_id),
            }

@router.get("/{symbol}/detail")
def get_stock_detail(symbol: str):

    with get_connection() as conn:
        with conn.cursor() as cur:

            # 1. Stock + company info
            cur.execute(
                """
                SELECT
                    stock.stock_id,
                    stock.symbol,
                    stock.current_price,
                    stock.total_shares,
                    company.company_name,
                    company.industry,
                    company.company_description
                FROM stock
                JOIN company ON company.company_id = stock.company_id
                WHERE stock.symbol = %s
                """,
                (symbol,),
            )

            row = cur.fetchone()

            if not row:
                raise HTTPException(status_code=404, detail="Stock not found")

            (
                stock_id,
                symbol,
                current_price,
                total_shares,
                company_name,
                industry,
                description,
            ) = row

            price = float(current_price)
            change_pct = get_change_pct(cur, stock_id, price)

            # 2. Price history (for the chart)
            cur.execute(
                """
                SELECT price, recorded_at
                FROM price_history
                WHERE stock_id = %s
                ORDER BY recorded_at ASC
                """,
                (stock_id,),
            )

            history_rows = cur.fetchall()

            price_history = []

            for hist_price, recorded_at in history_rows:
                price_history.append({
                    "label": recorded_at.strftime("%b %d"),
                    "price": float(hist_price),
                })

            # 3. Dividends
            cur.execute(
                """
                SELECT dividend_amount_pershare, dividend_date
                FROM dividends
                WHERE stock_id = %s
                ORDER BY dividend_date DESC
                """,
                (stock_id,),
            )

            dividend_rows = cur.fetchall()

            dividends = []

            now = datetime.now(timezone.utc).replace(tzinfo=None)

            for per_share, dividend_date in dividend_rows:

                is_upcoming = dividend_date > now

                dividends.append({
                    "perShare": float(per_share),
                    "date": dividend_date.strftime("%b %d, %Y"),
                    "status": "upcoming" if is_upcoming else "paid",
                })

            return {
                "symbol": symbol,
                "companyName": company_name,
                "industry": industry or "—",
                "description": description or "No description available.",
                "currentPrice": price,
                "changePct": change_pct,
                "totalShares": total_shares,
                "priceHistory": price_history,
                "dividends": dividends,
            }