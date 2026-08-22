import os

import jwt

from fastapi import HTTPException, Request


JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = "HS256"


def create_session(user_id: int, role: str) -> str:
    payload = {
        "user_id": user_id,
        "role": role,
    }

    return jwt.encode(
        payload,
        JWT_SECRET,
        algorithm=JWT_ALGORITHM,
    )


def get_current_user(request: Request):
    token = request.cookies.get("session")

    if not token:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated",
        )

    try:
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM],
        )

        return payload

    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=401,
            detail="Invalid session",
        )


def require_admin(request: Request):
    user = get_current_user(request)

    if user["role"] != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required",
        )

    return user




# create session
# read session
# check admin