import os
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from google.auth.transport import requests
from google.oauth2 import id_token
from pydantic import BaseModel

from app.db import get_connection   #connects to db

load_dotenv()  # Take environment variables from .env

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


class GoogleLoginRequest(BaseModel):
    credential: str


@router.post("/google")
def google_login(data: GoogleLoginRequest):

    google_client_id = os.getenv("GOOGLE_CLIENT_ID")

    if not google_client_id:
        raise RuntimeError("GOOGLE_CLIENT_ID is not set")

    try:
        google_user = id_token.verify_oauth2_token(
            data.credential,
            requests.Request(),
            google_client_id,
        )

    except ValueError:
        raise HTTPException(
            status_code=401,
            detail="Invalid Google ID token",
        )

    google_id = google_user["sub"]
    email = google_user.get("email")
    name = google_user.get("name", "")

    # if not email:
    #     raise HTTPException(
    #         status_code=400,
    #         detail="Google account has no email",
    #     )

    name_parts = name.split()

    first_name = name_parts[0] if name_parts else ""
    last_name = name_parts[-1] if len(name_parts) > 1 else ""

    with get_connection() as conn:
        with conn.cursor() as cur:

            cur.execute(
                """
       +         select user_id, google_id, email, first_name, middle_name, last_name, u_role, balance
                from users
                where google_id = %s
                """,
                (google_id,),
            )

            user = cur.fetchone()

            if user:
                return {
                    "message": "Login successful",
                    "user": {
                        "email": user[2],
                        "first_name": user[3],
                        "middle_name": user[4],
                        "last_name": user[5],
                        "role": user[6],
                        "balance": user[7],
                    },
                }
            #else - coz user found hoile return kore de so niche ar ashbena
            cur.execute(
                """
                INSERT INTO users (
                    google_id,
                    email,
                    first_name,
                    last_name
                )
                VALUES (%s, %s, %s, %s)
                """,
                (
                    google_id,
                    email,
                    first_name,
                    last_name,
                ),
            )
    return {
        "message": "Account created successfully",
    }