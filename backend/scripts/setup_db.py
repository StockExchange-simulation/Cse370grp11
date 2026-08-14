import psycopg
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

with psycopg.connect(DATABASE_URL) as conn:
    with open("sql/001_create_userTable.sql") as f:
        conn.execute(f.read())
    conn.commit()