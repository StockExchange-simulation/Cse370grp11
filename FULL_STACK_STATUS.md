# TradeSphere Full-Stack Status and Implementation Handoff

_Last reviewed: 2026-08-22_

This document explains how the TradeSphere frontend and backend currently work, why they are not connected, what is incomplete, and the recommended implementation order.

## 1. Executive Summary

TradeSphere is a stock-trading simulation with a React/Vite frontend and a FastAPI/PostgreSQL backend.

The current state is:

- The frontend is a substantial UI demo and renders successfully from local TypeScript mock data.
- The backend starts and has a health endpoint plus one Google authentication endpoint.
- The frontend does not use the backend for markets, portfolio, orders, transactions, dividends, profile, settings, or admin data.
- `src/lib/api.ts` describes future API calls, but no page currently uses it.
- Google login is the only frontend flow that currently calls the backend.
- The project must decide whether it is still a fake-data demo or is now moving to real backend integration. These are different phases and should not be mixed accidentally.

The most important technical fact is that the frontend and backend do not share a completed data contract or authentication/session design yet.

## 2. Current Architecture

```text
Browser
  |
  | React 19 + TypeScript + Vite
  | React Router
  | Local mock data in frontend/src/lib/data.ts
  |
  +-- Google login request only
          POST /api/auth/google
                    |
                    v
          FastAPI + PostgreSQL
          backend/app/main.py
          backend/app/routes/auth.py
          backend/app/db.py
```

### Frontend responsibilities

- Display the trading dashboard.
- Navigate between pages.
- Filter and calculate demo market and portfolio values locally.
- Display simulated orders and account activity.
- Provide a simulated trading experience.

### Backend responsibilities currently implemented

- Start a FastAPI application.
- Allow CORS requests from `http://localhost:5173`.
- Verify a Google ID token.
- Find or create a user in PostgreSQL.
- Return a basic login response.

### Backend responsibilities planned but not implemented

- Serve market and stock data.
- Manage authenticated sessions.
- Serve user portfolios and watchlists.
- Validate and place orders.
- Match buy and sell orders.
- Record transactions.
- Manage dividends and balances.
- Provide profile, settings, and admin APIs.

## 3. What Currently Works

### Frontend

The frontend has these working or mostly working areas:

- React/Vite application startup with `npm run dev`.
- TypeScript and Vite production build through `npm run build`.
- React Router navigation.
- Landing page at `/`.
- Login page at `/login`.
- Dashboard at `/dashboard`.
- Markets search using local data.
- Watchlist display using a local symbol list.
- Portfolio calculations using local holdings.
- Orders, transactions, and dividends pages using local records.
- Stock detail and buy/sell screens using local records.
- Theme switching during the current browser session.
- Simulated order-ticket total calculation.
- Responsive layout components, sidebar, top bar, tables, charts, and cards.

The frontend data source is primarily [`frontend/src/lib/data.ts`](frontend/src/lib/data.ts). The UI is not showing live market or account data.

### Backend

The backend has these working parts:

- FastAPI application startup in [`backend/app/main.py`](backend/app/main.py).
- Health response from `GET /`:

```json
{ "message": "Stock Exchange API is running" }
```

- CORS configuration for the local frontend origin.
- PostgreSQL connection helper in [`backend/app/db.py`](backend/app/db.py).
- Database schema setup script in [`backend/scripts/setup_db.py`](backend/scripts/setup_db.py).
- Google login route at `POST /api/auth/google`.
- Google ID-token verification using `google-auth`.
- Lookup of an existing user by `google_id`.
- Creation of a new user when no matching Google account exists.
- Database schema containing companies, users, stocks, holdings, wishlists, orders, transactions, dividends, and price history.

The Google endpoint previously returned a PostgreSQL syntax error because stray `+` characters had been inserted into its SQL. The current file no longer contains those characters, and the endpoint returned `200 OK` during the latest local run. A real Google credential and configured database are still required for a meaningful end-to-end test.

## 4. Why the Frontend Is Not Connected

The frontend is disconnected by design and by incomplete implementation:

1. Pages import arrays such as `marketRows`, `holdings`, `orders`, and `transactions` from `src/lib/data.ts`.
2. No page calls `api.getMarkets()`, `api.getPortfolio()`, `api.getOrders()`, or any equivalent backend function.
3. [`frontend/src/lib/api.ts`](frontend/src/lib/api.ts) is a future client stub, not an active integration layer.
4. The backend currently implements only authentication; it does not implement the business endpoints the screens need.
5. There is no completed authentication state shared across React components.
6. The backend does not yet issue a session cookie or bearer token after Google login.
7. The frontend cannot reliably identify the current user on later requests.
8. The database schema exists, but there is no service/repository layer that turns database rows into frontend response objects.
9. The frontend and backend types have not been formally matched.

This means simply changing a mock import to `fetch()` would not solve the problem. The backend contracts, session handling, server-side business rules, loading states, and tests must be built first.

## 5. Frontend Flaws and Required Work

### Authentication and routing

Current problems:

- The UI looks authenticated even when no user session exists.
- There is no `AuthContext` or equivalent shared session state.
- There is no `RequireAuth` route guard.
- `/admin` is not protected by a client-side role check.
- Logout behavior is incomplete or missing.
- Google login depends on the Google script loading before the component mounts.
- Google login uses `any` for the Google API and response types.
- Login errors and loading states are not presented clearly.
- The login callback routes to `/dashboard`, so that route must remain registered.

Work needed:

- Decide whether the current phase uses local demo login or real Google login.
- For demo mode, remove network login and use clearly labeled local demo authentication.
- For real mode, implement a backend session and a frontend auth provider.
- Add `/api/me`, logout, login loading, login errors, and protected routes.
- Add a server-side admin authorization check. A client-side check alone is not security.

### Data and interactions

Current problems:

- Markets, holdings, orders, transactions, dividends, profile, and admin data are static.
- Watchlist add/remove is not persisted.
- Submitting an order changes only local component state; it is not added to the orders page.
- Limit-order selection does not change backend or simulated behavior.
- Activity filters change UI state but do not consistently filter records.
- CSV export is not implemented.
- Settings are kept only in component memory.
- Profile editing is not implemented.
- Search in the shell is mainly visual and does not consistently control market filtering.
- Notifications and the profile menu have limited or no behavior.
- Empty, loading, and error states are incomplete.

Work needed:

- Finish local demo interactions before integration, or replace them deliberately with API calls.
- Add a shared data layer so pages do not fetch independently in ad hoc ways.
- Add loading, empty, error, retry, and success states.
- Persist demo-only settings/watchlists in local storage if the app remains offline.
- When connected, invalidate or refresh affected data after an order or watchlist mutation.

### Documentation and maintenance

- The existing `frontend/FRONTEND_STATUS.md` describes an older folder layout in places. The current source uses `frontend/src/pages/*.tsx`, not `src/pages/user/*.tsx`; inspect the source before following old import examples.
- The frontend README is still close to the Vite template and should document the actual TradeSphere commands and environment variables.
- There is no frontend test script.
- A successful build proves compilation, not that navigation, auth, filters, or trading behavior work.

## 6. Backend Flaws and Required Work

### API coverage

Only these backend routes are currently present:

- `GET /`
- `POST /api/auth/google`

The frontend needs at least these future routes:

| Area      | Suggested route                       | Purpose                                              |
| --------- | ------------------------------------- | ---------------------------------------------------- |
| Auth      | `POST /api/auth/google`               | Verify Google credential and create/sign in user     |
| Auth      | `GET /api/me`                         | Return the current authenticated user                |
| Auth      | `POST /api/auth/logout`               | Revoke/clear the current session                     |
| Markets   | `GET /api/markets`                    | Return stocks and current quotes                     |
| Stocks    | `GET /api/stocks/{symbol}`            | Return company, price history, and dividends         |
| Portfolio | `GET /api/portfolio/holdings`         | Return current user's holdings and calculated values |
| Watchlist | `GET /api/watchlist`                  | Return current user's watchlist                      |
| Watchlist | `POST/DELETE /api/watchlist/{symbol}` | Add or remove a symbol                               |
| Orders    | `GET /api/orders`                     | Return current user's orders                         |
| Orders    | `POST /api/orders`                    | Validate and create an order                         |
| Orders    | `POST /api/orders/{id}/cancel`        | Cancel an allowed pending order                      |
| Activity  | `GET /api/transactions`               | Return current user's transactions                   |
| Dividends | `GET /api/dividends`                  | Return current user's dividend records               |
| Profile   | `GET/PATCH /api/me`                   | Read or update allowed profile fields                |
| Settings  | `GET/PATCH /api/settings`             | Read or update user settings                         |
| Admin     | `GET /api/admin/...`                  | Return admin data only to authorized admins          |

These are recommendations, not implemented routes. Define request and response schemas before writing frontend calls.

### Authentication and security

Current problems:

- Google verification exists, but the endpoint does not establish a reusable session.
- The response for a newly created account does not return the created user object consistently.
- The email validation check is commented out.
- `GOOGLE_CLIENT_ID` configuration is duplicated as a module variable and a function lookup.
- Authentication errors should be converted into controlled API responses instead of leaking unexpected exceptions.
- There is no authorization dependency for normal users or admins.
- There is no CSRF/session strategy documented.
- There is no rate limiting, audit logging, or token/session expiry policy.

Work needed:

- Choose secure httpOnly cookie sessions or bearer tokens and document the choice.
- Return one stable response shape for login and current-user requests.
- Add `get_current_user` and `require_admin` dependencies.
- Validate Google claims, including email and audience, and handle missing claims.
- Keep secrets only in backend environment variables. Never place private secrets in `VITE_*` variables.
- Configure CORS for exact allowed frontend origins and credentials behavior.
- Add tests for invalid tokens, missing configuration, new users, existing users, and unauthorized admin access.

### Database and business logic

The schema in [`migration/001_initial_schema.sql`](migration/001_initial_schema.sql) is a useful starting point, but it is not yet a complete trading engine.

Issues to review:

- There are no backend repositories or services using most tables.
- There is no transaction-safe order placement workflow.
- Balance, available cash, stock supply, holdings, and order status are not updated by a service.
- There is no matching engine or clear rule for how buy and sell orders become transactions.
- `transactions` requires both `buyer_id` and `seller_id`, which must be defined for the initial market/liquidity model.
- There is no user-facing dividend allocation/payment workflow.
- Money fields use `DECIMAL(10, 2)` for user balance but larger precision elsewhere; choose consistent limits and precision.
- Timestamps should have an explicit timezone policy.
- Naming is inconsistent, for example `U_role` and `dividend_amount_PerShare`.
- Foreign-key and uniqueness rules need tests for all valid and invalid cases.
- The setup script executes the entire migration file but there is no migration versioning or repeatable deployment process.
- Database errors are not mapped to stable API errors.

Before real order placement, implement one atomic database transaction that validates the user, stock, quantity, price, balance/holdings, creates the order, updates affected records, and records the resulting transaction. Never trust a total or price calculated by the browser.

## 7. Contract Mapping: Mock Data to Database/API

| Frontend mock      | Database source                                     | API response should contain                        |
| ------------------ | --------------------------------------------------- | -------------------------------------------------- |
| `marketRows`       | `stock` + `company`                                 | symbol, company name, price, change, volume        |
| `stockDetails`     | `stock` + `company` + `price_history` + `dividends` | company details, current price, history, dividends |
| `watchlistSymbols` | `wishlists` + `stock`                               | current user's symbols                             |
| `holdings`         | `holdings` + `stock`                                | symbol, quantity, average cost, current value      |
| `orders`           | `orders` + `stock`                                  | id, side, quantity, price, total, status, date     |
| `transactions`     | `transactions` + related order/stock                | id, type, amount, date, status                     |
| `dividends`        | `dividends` plus user holdings/payment records      | payment amount, per-share amount, dates, status    |
| `currentUser`      | `users`                                             | user id, name, email, role, balance                |
| `portfolioSeries`  | `price_history` + holdings over time                | time-series portfolio values                       |

Do not make the frontend depend on raw database column names. Use Pydantic response models that match intentional TypeScript types.

## 8. Recommended Step-by-Step Implementation Plan

### Phase 0: Choose the product mode

1. Confirm whether the immediate deliverable is an offline demo or a connected application.
2. If it is an offline demo, remove or disable the real Google request and finish local interactions.
3. If it is connected, approve ending the fake-data-only policy and continue with the phases below.
4. Write the decision in the README so future contributors do not mix both modes.

### Phase 1: Make the backend reproducible

1. Create backend environment variables such as `DATABASE_URL` and `GOOGLE_CLIENT_ID` in a local `.env` file.
2. Ensure PostgreSQL is running and the target database exists.
3. Activate the backend virtual environment.
4. Run the schema setup script once and verify all tables exist.
5. Start the API from the repository root with `uvicorn app.main:app --reload` while the working directory is `backend`.
6. Verify `GET /` returns the health message.
7. Add a `/docs` check and basic automated API tests.
8. Do not commit `.env`, credentials, or database dumps.

### Phase 2: Finish authentication first

1. Define the login response model and the `GET /api/me` response model.
2. Decide between secure httpOnly cookie sessions and bearer tokens.
3. Implement session creation after Google verification.
4. Implement current-user and logout endpoints.
5. Add backend dependencies for authenticated users and admins.
6. Return controlled errors for invalid credentials, missing configuration, and database failures.
7. Add tests for new-user login, returning-user login, invalid token, logout, and role checks.

### Phase 3: Add read-only APIs

1. Implement `GET /api/markets`.
2. Implement `GET /api/stocks/{symbol}`.
3. Implement `GET /api/portfolio/holdings`.
4. Implement `GET /api/watchlist`, `GET /api/orders`, `GET /api/transactions`, and `GET /api/dividends`.
5. Add Pydantic models and stable JSON examples for every endpoint.
6. Test empty results, unknown symbols, unauthorized requests, and database failures.
7. Only after these endpoints work, connect the corresponding frontend pages one at a time.

### Phase 4: Connect the frontend data layer

1. Set `VITE_API_URL=http://localhost:8000` in the frontend environment.
2. Improve `src/lib/api.ts` with typed request/response models and consistent error handling.
3. Add an auth provider that loads `/api/me` on startup.
4. Add protected routes and an admin route guard.
5. Replace one mock source at a time, starting with markets.
6. Add loading, empty, error, and retry states to each connected page.
7. Connect profile and logout behavior.
8. Connect portfolio, orders, activity, dividends, and watchlist pages.
9. Remove mock imports only after the matching endpoint and UI state handling are verified.

### Phase 5: Implement safe order processing

1. Define the exact order request: symbol, side, quantity, order type, and optional limit price.
2. Validate all inputs on the server.
3. Re-read the price from the database on the server; never trust the browser total.
4. Check balance for buys and available holdings for sells.
5. Use one database transaction for order creation and all related updates.
6. Decide whether orders fill immediately or remain pending for a matching engine.
7. Add idempotency protection so retries cannot create duplicate orders.
8. Return the created order and refresh portfolio/activity data in the frontend.
9. Add tests for insufficient funds, insufficient holdings, invalid quantity, duplicate requests, and concurrent orders.

### Phase 6: Finish operations and UX

1. Add watchlist mutations and persistence.
2. Add order cancellation rules.
3. Add real transaction and dividend calculations.
4. Add profile/settings persistence.
5. Add admin metrics and actions with server-side authorization and audit logs.
6. Implement CSV export from the current displayed dataset.
7. Add pagination or controlled limits for growing tables.
8. Add mobile and deep-link deployment checks.
9. Replace the default frontend README with project-specific setup instructions.

### Phase 7: Verification before calling it complete

1. Run the backend test suite.
2. Run `npm run build` from `frontend`.
3. Start both services.
4. Log in and confirm `/api/me` identifies the same user after refresh.
5. Confirm markets come from the API, not `data.ts`.
6. Confirm a watchlist change persists after refresh.
7. Confirm an order updates orders, holdings, balance, and transactions consistently.
8. Confirm a normal user cannot access admin data.
9. Confirm invalid input is rejected by the backend.
10. Test direct navigation to every frontend route in a production-like server configuration.

## 9. Useful Local Commands

### Frontend

```bash
cd /data/370project/Cse370grp11/frontend
npm install
npm run build
npm run dev
```

### Backend

```bash
cd /data/370project/Cse370grp11/backend
source venv/bin/activate
uvicorn app.main:app --reload
```

### Database setup

```bash
cd /data/370project/Cse370grp11/backend
source venv/bin/activate
python scripts/setup_db.py
```

Use the actual configured Python environment and database credentials for your machine. Run setup only against the intended development database.

## 10. Definition of Done

The project is connected and reasonably complete when:

- Authentication creates and maintains a secure session.
- Every protected API identifies the current user from the session, not a browser-supplied user id.
- Frontend business pages consume typed API responses instead of static mock arrays.
- The backend validates all trading rules and performs updates atomically.
- Orders, holdings, balances, transactions, and dividends agree with one another.
- Admin endpoints enforce role authorization on the server.
- Frontend pages handle loading, empty, error, and success states.
- Automated backend tests and a frontend build pass.
- Setup, environment variables, API contracts, and demo/live mode are documented.

Until these conditions are met, the frontend should be described as a working demonstration UI, not a working online trading application.
