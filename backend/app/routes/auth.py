# POST /api/auth/google
# GET  /api/auth/me
# POST /api/auth/logout

import os
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Request
from google.auth.transport import requests
from google.oauth2 import id_token
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from app.auth import create_session, get_current_user

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

     # 1. Verify Google ID token
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
                select user_id, email, first_name, middle_name, last_name, u_role, balance
                from users
                where google_id = %s
                """,
                (google_id,),
            )

            user = cur.fetchone()

            # Existing user
            if user:
                user_id = user[0]
                role = user[5]

            # New user
            else:
                cur.execute(
                    """
                    INSERT INTO users (
                        google_id,
                        email,
                        first_name,
                        last_name
                    )
                    VALUES (%s, %s, %s, %s)
                    RETURNING user_id, u_role       
                    """,
                    (
                        google_id,
                        email,
                        first_name,
                        last_name,
                    ),          #insert and returns user_id, u_role
                )

                new_user = cur.fetchone()

                user_id = new_user[0]
                role = new_user[1]

            conn.commit()

# 4. Create our own session
    token = create_session(
        user_id=user_id,
        role=role,
    )

    # 5. Send session as HttpOnly cookie
    response = JSONResponse({
        "message": "Login successful"
    })

    response.set_cookie(
        key="session",
        value=token,
        httponly=True,
        secure=False,      # True when using HTTPS in production
        samesite="lax",
        max_age=60 * 60 * 24 * 7,       #7days
    )

    return response
            
