from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from app.routes.auth import router as auth_router
from app.routes.portfolio import router as portfolio_router
from app.routes.admin import router as admin_router
from app.routes.orders import router as orders_router
from app.db import get_connection
from app.routes.watchlist import router as watchlist_router
from app.routes.markets import router as markets_router
from app.routes.dividends import router as dividends_router
app = FastAPI(title="Stock Exchange Simulation")

FRONTEND_URL = os.getenv("FRONTEND_URL")

if not FRONTEND_URL:
    raise RuntimeError("FRONTEND_URL is not set")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],        
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(portfolio_router)
app.include_router(orders_router)
app.include_router(watchlist_router)
app.include_router(markets_router)
app.include_router(dividends_router)
@app.get("/")
def root():
    return {"message": "Stock Exchange API is running"}