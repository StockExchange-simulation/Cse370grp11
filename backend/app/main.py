from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db import get_connection

app = FastAPI(title="Stock Exchange Simulation")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],        
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}


@app.get("/api/db-test")
def database_test():
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT 1")
            result = cursor.fetchone()

    return {"database": result[0]}