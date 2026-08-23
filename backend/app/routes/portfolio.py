# app/routes/portfolio.py

from fastapi import APIRouter, Request

from app.auth import get_current_user
from app.db import get_connection

router = APIRouter(prefix="/api/portfolio", tags=["Portfolio"])


@router.get("/summary")
def get_portfolio_summary(request: Request):

    session = get_current_user(request)
    user_id = session["user_id"]

    with get_connection() as conn:
        with conn.cursor() as cur:

            cur.execute(
                """
                SELECT
                    holdings.quantity,
                    holdings.avg_price,
                    stock.current_price
                FROM holdings
                JOIN stock ON stock.stock_id = holdings.stock_id
                WHERE holdings.user_id = %s
                """,
                (user_id,),
            )

            rows = cur.fetchall()

    portfolio_value = 0
    buying_cost= 0

    for quantity, avg_price, current_price in rows:
        portfolio_value += (quantity * current_price)
        buying_cost+= (quantity * avg_price)

    total_return = portfolio_value - buying_cost

    if buying_cost > 0:
        return_percent = (total_return / buying_cost) * 100
    else:
        return_percent = 0

    return {
        "portfolio_value": float(portfolio_value),
        "total_return": float(total_return),
        "return_percent": float(return_percent),
    }




#     get_current_user(request) — same guard you already use, just without the require_admin 
# step, since any logged-in user should see their own portfolio.

# We JOIN holdings with stock to get both what the user paid (avg_price) 
# and what it's worth now (current_price) in one query.

# We loop through every holding row in Python, adding up portfolio_value (current worth) and 
# cost_basis (what they originally paid).
# total_return = portfolio_value - cost_basis — positive means they're up, 
# negative means down.

# return_percent — guarded against divide-by-zero for a user with no holdings yet.
# float(...) — Postgres DECIMAL types come back as Python Decimal objects,
#  which don't serialize to JSON cleanly by default; converting to float avoids errors.



@router.get("/holdings")
def get_holdings(request: Request):

    session = get_current_user(request)
    user_id = session["user_id"]

    with get_connection() as conn:
        with conn.cursor() as cur:

            cur.execute(
                """
                SELECT
                    stock.symbol,
                    company.company_name,
                    holdings.quantity,
                    holdings.avg_price,
                    stock.current_price
                FROM holdings
                JOIN stock ON stock.stock_id = holdings.stock_id
                JOIN company ON company.company_id = stock.company_id
                WHERE holdings.user_id = %s
                  AND holdings.quantity > 0
                """,
                (user_id,),
            )

            rows = cur.fetchall()

    result = []

    for symbol, company_name, quantity, avg_price, current_price in rows:
        result.append({
            "symbol": symbol,
            "name": company_name,
            "shares": quantity,
            "avgCost": float(avg_price),
            "price": float(current_price),
        })

    return result