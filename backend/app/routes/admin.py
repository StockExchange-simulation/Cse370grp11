# app/routes/admin.py

from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from app.auth import require_admin
from app.db import get_connection

router = APIRouter(prefix="/api/admin", tags=["Admin"])


@router.get("/stats/total-users")
def get_total_users(request: Request):

    require_admin(request)

    with get_connection() as conn:
        with conn.cursor() as cur:

            cur.execute(
                """
                SELECT COUNT(*)
                FROM users
                """
            )

            result = cur.fetchone()

    return {
        "total_users": result[0]
    }



# require_admin(request) — this is the guard. It checks the session cookie, decodes the JWT, 
# and confirms role == "admin". If not, it raises a 403 automatically and the function stops 
# right there — nothing below it runs.



@router.get("/stats/todays-transactions")
def get_todays_transactions(request: Request):

    require_admin(request)

    with get_connection() as conn:
        with conn.cursor() as cur:

            cur.execute(
                """
                SELECT COUNT(*)
                FROM transactions
                WHERE trx_date >= CURRENT_DATE
                """
            )

            result = cur.fetchone()

    return {
        "todays_transactions": result[0]
    }

# WHERE trx_date >= CURRENT_DATE — CURRENT_DATE in Postgres gives today's date at midnight 
# (00:00:00). Since trx_date is a TIMESTAMP, this filters to only rows from 
# today onward — i.e., every transaction made today.


class AddCompanyRequest(BaseModel):
    company_name: str
    industry: str | None = None
    company_description: str | None = None


@router.post("/companies")
def add_company(data: AddCompanyRequest, request: Request):

    require_admin(request)

    with get_connection() as conn:
        with conn.cursor() as cur:

            cur.execute(
                """
                INSERT INTO company (
                    company_name,
                    industry,
                    company_description
                )
                VALUES (%s, %s, %s)
                RETURNING company_id
                """,
                (
                    data.company_name,
                    data.industry,
                    data.company_description,
                ),
            )

            result = cur.fetchone()

        conn.commit()

    return {
        "message": "Company added successfully",
        "company_id": result[0],
    }



# AddCompanyRequest — a pydantic model. FastAPI automatically parses the incoming JSON body 
# against this schema. If company_name is missing, FastAPI rejects the request with a 
# 422 automatically, before your function body even runs.

# industry: str | None = None — means this field is optional; 
# if the frontend doesn't send it, it defaults to None (which becomes SQL NULL).
# require_admin(request) — same guard as before.
# INSERT ... RETURNING company_id — inserts the row and gets back the new auto-generated 
#company_id in one query.

# conn.commit() — important: unlike your SELECT queries before, this is a write,
#  so it needs to be committed to actually save to the database.
#  Your google_login route does this too — same pattern.




#add stock
#gets input in this object
class AddStockRequest(BaseModel):
    symbol: str
    base_price: float
    share_count: int
    company_name: str
    initial_user_id: int


@router.post("/stocks")
def add_stock(data: AddStockRequest, request: Request):

    require_admin(request)

    with get_connection() as conn:
        with conn.cursor() as cur:

            # 1. Look up the company by name
            cur.execute(
                """
                SELECT company_id
                FROM company
                WHERE company_name = %s
                """,
                (data.company_name,),
            )

            company = cur.fetchone()

            if not company:
                raise HTTPException(
                    status_code=404,
                    detail="Company not found",
                )

            company_id = company[0]


            # 3. Create the stock
            cur.execute(
                """
                INSERT INTO stock (
                    symbol,
                    current_price,
                    total_shares,
                    company_id
                )
                VALUES (%s, %s, %s, %s)
                RETURNING stock_id
                """,
                (
                    data.symbol,
                    data.base_price,
                    data.share_count,
                    company_id,
                ),
            )

            stock = cur.fetchone()
            stock_id = stock[0]

            # 4. Give all shares to the initial user's holding
            cur.execute(
                """
                INSERT INTO holdings (
                    user_id,
                    stock_id,
                    quantity,
                    avg_price
                )
                VALUES (%s, %s, %s, %s)
                """,
                (
                    data.initial_user_id,
                    stock_id,
                    data.share_count,
                    data.base_price,
                ),
            )

        conn.commit()

    return {
        "message": "Stock added successfully",
        "stock_id": stock_id,
    }


# Look up company by name — if no row matches, we raise HTTPException(404, ...) 
# and stop immediately. Nothing gets inserted.
# Confirm the initial user exists — same idea. This catches typos/bad IDs before we 
# try to create a holdings row that would otherwise fail with a confusing foreign-key 
# error from Postgres instead of a clean message.
# Insert into stock — same RETURNING pattern as before, gives us the new stock_id.
# Insert into holdings — creates the ownership row: this user now holds share_count shares of this stock.
# conn.commit() — only happens once, at the very end, after both inserts succeed. This matters: 
# if step 4 failed for some reason, you would NOT want step 3's insert to be saved 
# without a matching holding — that'd leave an orphaned stock with no owner. 
# Since both cur.execute() calls happen before the single commit(), 
# they succeed or fail together as one unit (this is called a transaction).




class AddDividendRequest(BaseModel):
    symbol: str
    pay_per_share: float
    dividend_date: str


@router.post("/dividends")
def add_dividend(data: AddDividendRequest, request: Request):

    require_admin(request)

    with get_connection() as conn:
        with conn.cursor() as cur:

            # 1. Look up the stock by symbol
            cur.execute(
                """
                SELECT stock_id
                FROM stock
                WHERE symbol = %s
                """,
                (data.symbol,),
            )

            stock = cur.fetchone()

            if not stock:
                raise HTTPException(
                    status_code=404,
                    detail="Stock not found",
                )

            stock_id = stock[0]

            # 2. Insert the dividend
            cur.execute(
                """
                INSERT INTO dividends (
                    stock_id,
                    dividend_amount_PerShare,
                    dividend_date,
                    announcement_date
                )
                VALUES (%s, %s, %s, CURRENT_TIMESTAMP)
                RETURNING dividend_id
                """,
                (
                    stock_id,
                    data.pay_per_share,
                    data.dividend_date,
                ),
            )

            result = cur.fetchone()

        conn.commit()

    return {
        "message": "Dividend added successfully",
        "dividend_id": result[0],
    }