CREATE TABLE "user" (
    user_id       SERIAL PRIMARY KEY,
    email         VARCHAR(255) UNIQUE NOT NULL,
    fname         VARCHAR(100) NOT NULL,
    mname         VARCHAR(100),
    lname         VARCHAR(100) NOT NULL,
    password_hash TEXT NOT NULL,
    balance       NUMERIC(12,2) NOT NULL DEFAULT 10000.00,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);