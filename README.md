# TradeSphere

TradeSphere is a stock-market simulation with Google authentication, a FastAPI backend, a PostgreSQL database, and a React/TypeScript frontend. Users can browse simulated markets, maintain a watchlist, place buy and sell orders, review portfolio activity, and view dividends. Admin users can add companies, stocks, and dividends.

This project is for educational use. It does not connect to a real exchange and does not provide financial advice.

## Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, React Router
- **Backend:** FastAPI, Uvicorn, Psycopg 3, PyJWT
- **Database:** PostgreSQL
- **Authentication:** Google Identity Services plus an HttpOnly session cookie

## Repository layout

```text
backend/                 FastAPI application and Python dependencies
frontend/                React application and frontend dependencies
migration/               PostgreSQL schema, migrations, and seed data
docs/                    Setup and deployment notes
```

## Prerequisites

- Python 3.11 or newer
- Node.js 18 or newer
- pnpm 9 or newer (or npm, with the equivalent commands)
- A PostgreSQL 14+ database, local or hosted
- A Google OAuth 2.0 Web client ID

## Quick start

### 1. Clone the repository

```bash
git clone https://github.com/<your-account>/<your-repository>.git
cd Cse370grp11
```

### 2. Create the database

Create an empty PostgreSQL database, then apply the SQL files from the repository root in this order:

```bash
# Use your own PostgreSQL connection string here.
export DATABASE_URL='postgresql://postgres:password@localhost:5432/tradesphere'
psql "$DATABASE_URL" -f migration/001_initial_schema.sql
psql "$DATABASE_URL" -f migration/002_fix_avg_price.sql
psql "$DATABASE_URL" -f migration/003_fix_transaction_constraint.sql
```

To load the sample companies, stocks, and price history:

```bash
psql "$DATABASE_URL" -f migration/seed.sql
```

`seed.sql` truncates existing market data before inserting its fixtures. Do not run it against a database containing data you need to keep.

### 3. Configure and start the backend

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your PostgreSQL connection string, a long random JWT secret, your Google Web client ID, and the frontend URL.

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\\Scripts\\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API is available at http://localhost:8000 and its interactive documentation is at http://localhost:8000/docs.

### 4. Configure and start the frontend

In a second terminal, from the repository root:

```bash
cp frontend/.env.example frontend/.env
cd frontend
pnpm install
pnpm dev
```

Open http://localhost:5173. Set `VITE_GOOGLE_CLIENT_ID` to the same Google Web client ID used by the backend.

## Google sign-in setup

1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Create or select a project and configure the OAuth consent screen.
3. Create an OAuth client of type **Web application**.
4. Add `http://localhost:5173` to **Authorized JavaScript origins**.
5. Copy the client ID into both `backend/.env` (`GOOGLE_CLIENT_ID`) and `frontend/.env` (`VITE_GOOGLE_CLIENT_ID`).

For a deployed instance, add the deployed frontend origin and set `FRONTEND_URL` to that exact origin.

## Environment variables

The committed example files document every application variable:

- [backend/.env.example](backend/.env.example)
- [frontend/.env.example](frontend/.env.example)

Never commit `.env` files, database passwords, JWT secrets, or private OAuth credentials. `VITE_*` values are embedded into the browser bundle, so they are not suitable for secrets.

## Useful commands

```bash
cd frontend
pnpm build
pnpm preview
```

Backend smoke check:

```bash
curl http://localhost:8000/
```

Expected response: `{"message":"Stock Exchange API is running"}`

## Deployment notes

- Deploy the frontend and backend with HTTPS in production.
- Use a managed PostgreSQL database and apply migrations before starting the API.
- Update Google OAuth authorized origins for the deployed frontend.
- Set `secure=True` for the session cookie before deploying behind HTTPS; the current development configuration uses `secure=False` for localhost.
- Rotate any credential that may have appeared in a public repository or log.

## License

No license has been declared yet. Until one is added, permission to reuse this repository should not be assumed.
