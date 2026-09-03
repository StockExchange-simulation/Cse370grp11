# Setup reference

This page expands the quick-start section in the root README.

## Database migration order

Run these files once against an empty PostgreSQL database:

1. `migration/001_initial_schema.sql` creates the tables and indexes.
2. `migration/002_fix_avg_price.sql` adds average holding price.
3. `migration/003_fix_transaction_constraint.sql` updates the seller-holding constraint and adds order execution type.

The optional `migration/seed.sql` clears the market tables and inserts demonstration data. It is useful for local development only.

The `migration/scripts/setup_db.py` helper currently applies only migration 003. It assumes `DATABASE_URL` is available in the shell or in `backend/.env`, and it should be run from the `backend` directory after migrations 001 and 002 have already been applied:

```bash
cd backend
python ../migration/scripts/setup_db.py
```

## Configuration checklist

Backend variables: `DATABASE_URL`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, and `FRONTEND_URL`.

Frontend variables: `VITE_API_URL` and `VITE_GOOGLE_CLIENT_ID`.

The Google client ID must match in both applications. `FRONTEND_URL` must exactly match the browser origin, including scheme and port.

## Troubleshooting

**The API says an environment variable is not set.** Confirm that `backend/.env` exists and that the API was started from the `backend` directory.

**The browser reports a CORS error.** Set `FRONTEND_URL` to the exact URL in the browser address bar, then restart the backend.

**Google login fails.** Confirm that both client ID variables match and that the frontend origin is listed in Google Cloud Console under Authorized JavaScript origins.

**The frontend cannot reach the API.** Confirm Uvicorn is running on port 8000 and restart Vite after changing `.env`.
