import psycopg
import os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

BASE_DIR = Path(__file__).resolve().parents[2]
migration_file = BASE_DIR / "migration" / "002_fix_avg_price.sql"
with psycopg.connect(DATABASE_URL) as conn:
    with open(migration_file) as f:
        conn.execute(f.read())
    conn.commit()