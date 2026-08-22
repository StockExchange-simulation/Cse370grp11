# TradeSphere Frontend Status and Handoff

_Last updated: 2026-08-21_

This document is the complete frontend handoff for future ChatGPT, Claude, or developer sessions. Read it before changing the frontend. It describes the current implementation, the fake-data requirement, known bugs, incomplete features, and the intended future direction.

## 1. Project Summary

TradeSphere is a stock-trading dashboard frontend. The frontend is currently a demonstration application and is not ready for real trading or real user data.

Technology currently used:

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS v4
- `lucide-react` icons
- Local TypeScript mock data
- FastAPI/PostgreSQL backend exists in the repository, but the frontend must not use real backend business data at this stage

Frontend root:

```text
/data/370project/Cse370grp11/frontend
```

Start and build commands:

```bash
cd frontend
npm run dev
npm run build
npm run preview
```

The correct working directory is `frontend`. Running `npm run build` from the repository root fails because the root does not contain a `package.json`.

## 2. Non-Negotiable Fake-Data Policy

### Current requirement

The frontend must use fake/demo data only. Do not fetch markets, portfolios, orders, transactions, dividends, profile information, settings, admin data, or other business data from the FastAPI backend.

This is intentional. The current frontend is being developed and demonstrated independently of the backend.

Future agents must follow these rules:

1. Do not replace imports from `src/lib/data.ts` with API calls.
2. Do not call `src/lib/api.ts` or `src/services/api.ts` for business data.
3. Do not add `fetch`, Axios, React Query, SWR, WebSockets, or server loaders for market or account data unless the project owner explicitly changes this policy.
4. Keep all displayed financial values deterministic and local.
5. When implementing interactions, update local React state or local mock data only.
6. Clearly label simulated actions as demo/simulated behavior.
7. Do not use real account, market, portfolio, or transaction data in screenshots, examples, fixtures, or UI defaults.
8. If backend integration is discussed, document it as future work instead of implementing it.

### Current mock-data source

The primary source of truth is:

```text
frontend/src/lib/data.ts
```

It contains the following local types and records:

- `MarketRow`: symbol, company name, price, percentage change, and volume
- `marketRows`: seven hard-coded stocks including AAPL, NVDA, MSFT, TSLA, AMZN, GOOGL, and META
- `watchlistSymbols`: five hard-coded watchlist symbols
- `OrderRow`: order id, symbol, side, shares, price, total, status, and date
- `orders`: five hard-coded order records
- `Holding`: symbol, company name, shares, average cost, and current price
- `holdings`: five hard-coded portfolio positions
- `TransactionRow`: transaction type, description, amount, date, and status
- `transactions`: five hard-coded account activity records
- `DividendRow`: symbol, amount, per-share payment, pay date, and status
- `dividends`: three hard-coded dividend records
- `portfolioSeries`: hard-coded chart values for the performance chart
- `currentUser`: the demo user Alex Smith
- `usd`: local currency formatting helper
- `pct`: local percentage formatting helper
- `findMarket`: local lookup helper for mock market rows

The values in this file are not live prices and do not represent a real account. They are only UI demonstration data.

### Pages using fake data

- `src/pages/user/Dashboard.tsx` uses markets, orders, watchlist symbols, portfolio series, and the demo user.
- `src/pages/user/Markets.tsx` filters `marketRows` locally and uses `watchlistSymbols` locally.
- `src/pages/user/Portfolio.tsx` calculates market value, invested amount, gain, and gain percentage locally from `holdings`.
- `src/pages/user/Activity.tsx` renders local `orders`, `transactions`, and `dividends`.
- `src/pages/user/Profile.tsx` uses `currentUser`.
- `src/pages/user/Admin.tsx` contains local demo administrator metrics and users.
- `src/pages/user/Settings.tsx` stores settings only in component memory.
- `src/components/AppShell.tsx` uses `currentUser` and hard-coded UI values such as the notification count and market-open indicator.
- `src/components/OrderTicket.tsx` uses `findMarket` and calculates the estimated order total locally.
- `src/components/PerformanceChart.tsx` renders the supplied local chart series.

## 3. Application Entry and Routing

### Entry point

`src/main.tsx`:

- Imports React and React DOM.
- Imports `BrowserRouter`.
- Imports the root `App` component.
- Imports `src/index.css`.
- Renders the app inside `StrictMode` and `BrowserRouter`.

`BrowserRouter` is already present in `main.tsx`. Do not add another router around individual pages.

### Current routes

Routes are defined in `src/App.tsx`:

| Path | Component | Current behavior |
| --- | --- | --- |
| `/` | `Dashboard` inside `AppShell` | Main dashboard; currently the first screen |
| `/markets` | `Markets` | Local mock market list and search |
| `/portfolio` | `Portfolio` | Local mock holdings and calculations |
| `/orders` | `Activity kind="orders"` | Local mock orders |
| `/transactions` | `Activity kind="transactions"` | Local mock transactions |
| `/watchlist` | `Markets watchlistOnly` | Local subset of mock markets |
| `/dividends` | `Activity kind="dividends"` | Local mock dividends |
| `/profile` | `Profile` | Local demo profile |
| `/admin` | `Admin` | Local demo admin page; currently not protected |
| `/settings` | `Settings` | Local in-memory settings |
| unknown paths | `Dashboard` | Wildcard fallback to dashboard |

Most pages are wrapped by `AppShell`, which provides the top bar, sidebar, mobile navigation, theme toggle, and outlet.

### No landing page

There is currently no landing or marketing page.

The root path `/` opens directly into the authenticated-looking dashboard. This is a product decision that still needs to be resolved:

- Either intentionally keep `/` as the demo dashboard,
- or create a public landing page and decide whether `/` should show the landing page or redirect to login.

Do not assume that a landing page already exists.

## 4. Login and Authentication Status

### Existing files

- `src/pages/login.tsx`
- `src/components/GoogleLogin.tsx`

The login page currently contains a basic title, subtitle, and Google login component. It is not a complete authentication experience.

### Current login problems

1. `src/pages/login.tsx` is not registered in `src/App.tsx`.
2. There is no `/login` route.
3. The application assumes the user is already authenticated.
4. There is no authentication context or session state.
5. There is no logout flow.
6. There is no `RequireAuth` or protected-route wrapper.
7. All dashboard routes can be opened directly.
8. `/admin` has no client-side role guard.
9. The login screen has no user-facing loading or error state.
10. `GoogleLogin.tsx` assumes that `window.google` is ready when the component mounts and does not retry if the Google script has not loaded.
11. `window.google` is typed as `any`.
12. The Google callback navigates to `/dashboard`, but the current route table has no explicit `/dashboard` route. The wildcard route catches it and displays the dashboard.

### Fake-data conflict

`src/components/GoogleLogin.tsx` performs a real network request:

```text
POST http://127.0.0.1:8000/api/auth/google
```

It sends the Google credential to the backend and logs the response. This is the only obvious runtime business-related backend request in the frontend, and it conflicts with the fake-data-only requirement.

The frontend also loads the Google Identity Services script from `index.html`, so Google login is not fully local or offline.

### Recommended current solution

For the current demo phase, replace the real Google login with a local demo login that:

- never calls the backend,
- does not send credentials anywhere,
- sets local demo authentication state,
- routes to the dashboard after a local success action,
- shows a clear simulated/demo label,
- supports a local logout action.

Real Google authentication should be treated as a separate future integration and must not be implemented without explicit approval to leave fake-only mode.

## 5. Component Structure

### Layout and shared components

- `src/components/AppShell.tsx`: top bar, logo, desktop sidebar, mobile sidebar, theme toggle, search field, notification icon, profile control, and page outlet.
- `src/components/ui.tsx`: shared cards, buttons, page titles, asset markers, status badges, and formatting UI primitives.
- `src/components/StatCard.tsx`: dashboard metric card.
- `src/components/PerformanceChart.tsx`: local SVG performance chart.
- `src/components/MarketTable.tsx`: market table using supplied mock rows.
- `src/components/OrderTicket.tsx`: simulated buy/sell order form.
- `src/components/GoogleLogin.tsx`: real Google Identity Services integration that currently conflicts with the fake-only requirement.

### User pages

- `Dashboard.tsx`: overview metrics, chart, watchlist, recent orders, and quick trade ticket.
- `Markets.tsx`: local market search and market table.
- `Portfolio.tsx`: local holdings and calculated portfolio metrics.
- `Activity.tsx`: orders, transactions, and dividends variants.
- `Profile.tsx`: demo user profile.
- `Settings.tsx`: local notification settings.
- `Admin.tsx`: demo admin overview.
- `login.tsx`: currently unreachable basic login screen.

## 6. Known Import-Path Problem

The folder layout is:

```text
src/
  components/
    MarketTable.tsx
    StatCard.tsx
    ui.tsx
  lib/
    data.ts
  pages/
    user/
      Dashboard.tsx
      Markets.tsx
      Portfolio.tsx
```

A page inside `src/pages/user` must move up two directories to reach `src/components` or `src/lib`.

Correct examples:

```tsx
import { StatCard } from '../../components/StatCard'
import { MarketTable } from '../../components/MarketTable'
import { Card } from '../../components/ui'
import { marketRows } from '../../lib/data'
```

Incorrect examples from a page in `src/pages/user`:

```tsx
import { StatCard } from '../components/StatCard'
import { Card } from '../components/ui'
import { marketRows } from '../lib/data'
```

The incorrect version searches under `src/pages/components` or `src/pages/lib`, which do not exist.

This caused Vite errors such as:

```text
Failed to resolve import "../components/StatCard"
Failed to resolve import "../components/MarketTable"
Failed to resolve import "../components/ui"
Failed to resolve import "../lib/data"
```

When an import error appears, first compare the importing file's directory with the target file's directory. Linux paths are case-sensitive.

## 7. Incomplete and Nonfunctional Features

### High priority

- Add and correct the login route.
- Decide whether the project needs a landing page.
- Keep login local and fake-only unless backend authentication is explicitly approved.
- Add local demo auth state and local logout.
- Add a local protected-route experience if the demo should simulate authentication.
- Decide how the admin demo should be entered and add a local role guard if needed.
- Ensure all imports use paths relative to the importing file.
- Run the build after route or import changes.

### Dashboard

- Portfolio summary values are hard-coded or derived from local mock data.
- The performance chart uses local values.
- The chart period selector is not fully wired to alternate local series.
- Quick trade is simulated only.
- Empty, loading, and error states are not implemented.

### AppShell

- Search input is visual and does not navigate or filter the market page.
- Notifications button has no behavior.
- User menu button has no dropdown or logout behavior.
- Notification count is hard-coded.
- Market-open status is hard-coded.
- Dark mode changes the DOM class but is not persisted after refresh.
- Support-center block is visual only.
- Admin navigation is visible without authorization.

### Markets and watchlist

- Market search filters local data and works only in memory.
- Watchlist view filters local symbols.
- Add/remove watchlist behavior is missing.
- Market table trade actions may do nothing when no action callback is supplied.
- There are no local success, failure, or empty-result states.
- No local mock mutation layer exists for watchlist updates.

### Orders

- Buy/sell selection works locally.
- Quantity changes the locally calculated estimated total.
- Submit only changes local `submitted` state.
- No order is stored in the mock order list.
- No order appears in the orders page after submission.
- Limit order selection is displayed but does not change behavior.
- The component is explicitly a simulated order ticket and must remain that way under the current policy.

### Activity pages

- Orders, transactions, and dividends render mock tables.
- The `All` and `This month` filter state changes, but the displayed rows are not actually filtered.
- Export CSV button has no implementation.
- There is no pagination.
- There are no empty, loading, or error states.

### Profile and settings

- Profile values are mock values.
- Edit profile action is not implemented.
- Profile account-setting rows have no behavior.
- Settings toggles update only local component state.
- Settings are not persisted to local storage or a backend.
- No save confirmation or reset behavior exists.

### Admin

- Admin metrics and users are fake data.
- No authentication guard exists.
- No role/permission check exists.
- No admin actions are implemented.
- It must not be connected to real user data under the current fake-only policy.

## 8. Backend and API Files: Planning Only

The following files exist but are not the source of displayed frontend data:

### `src/lib/api.ts`

This is an unused planned API client. It contains future stubs for:

- `GET /api/markets`
- `GET /api/portfolio`
- `GET /api/orders`
- `POST /api/orders`
- `POST /auth/login`
- `POST /auth/logout`

It reads `VITE_API_URL` and uses `fetch`. Do not activate it while fake-only mode is required.

### `src/services/api.ts`

This is another generic API helper. It uses a hard-coded backend URL and has no known page consumers. It is not an active frontend data source.

### TODO comments

Several page and component comments describe future FastAPI endpoints. These comments are design notes only. They do not mean that the corresponding feature is currently connected.

Future backend work should happen only after an explicit product decision. At that point, design a deliberate data-fetching and authentication architecture rather than mixing live calls into individual components.

## 9. External Resources and Configuration

`index.html` currently loads:

- Google Material Symbols stylesheet
- Google Fonts / Inter
- Google Identity Services JavaScript

The Google Identity Services script is related to the real login implementation and should be removed or replaced if the app must be strictly local and fake-only.

Other concerns:

- `VITE_*` variables are exposed to the browser and must never contain private secrets.
- `VITE_API_URL` is intended for future integration but should not be used for business data currently.
- `VITE_GOOGLE_CLIENT_ID` may exist for the current Google integration, but the current recommended demo login should not depend on it.
- `BrowserRouter` requires server-side fallback configuration for direct deep links in production.
- `src/index.css` uses Tailwind CSS v4 `@theme`. VS Code's basic CSS validator may report `Unknown at rule @theme` even when the Tailwind build accepts it. If the build succeeds, this is generally an editor warning.
- The frontend README is still close to the default Vite template and should eventually document TradeSphere-specific setup and fake-data rules.

## 10. Build, Lint, and Test Status

The primary build command is:

```bash
cd /data/370project/Cse370grp11/frontend
npm run build
```

The build runs:

```text
tsc -b && vite build
```

Current package scripts are:

- `dev`
- `build`
- `preview`

There is currently no test script. There is no dependable frontend test suite documented. Do not claim the UI is fully tested just because TypeScript or Vite builds successfully.

When Vite reports an import error:

1. Stop reading the error log at the first unresolved import.
2. Check whether the target file exists.
3. Check the relative path from the importing file.
4. Check capitalization.
5. Run `npm run build` from `frontend`.
6. Restart the Vite dev server if stale HMR errors remain.

## 11. Recommended Completion Order

### Phase 1: Demo-safe fixes

1. Fix all relative imports and confirm the build.
2. Add a `/login` route.
3. Decide whether `/` should remain the dashboard or become a landing page.
4. Implement local demo login without network calls.
5. Add local logout and demo auth state.
6. Add a simple local route guard if protected-route behavior is needed for the demo.
7. Implement local watchlist add/remove.
8. Make order submission update local demo activity, or clearly keep it as a non-persistent simulation.
9. Make activity filters work with the local records.
10. Implement CSV export using local data only.
11. Add local persistence for theme and settings if desired.

### Phase 2: UX completeness

1. Wire the dashboard period selector to local chart variants.
2. Make global search navigate to or filter markets.
3. Add notification and profile-menu behavior.
4. Add empty and no-result states.
5. Add local success and error feedback.
6. Improve mobile and deep-link behavior.
7. Replace the generic README with project-specific setup documentation.

### Phase 3: Future backend integration, only with approval

1. Confirm that fake-only mode is being ended.
2. Define authentication and session requirements.
3. Define API response contracts matching the TypeScript types.
4. Decide how loading, errors, retries, pagination, and authorization work.
5. Replace mock sources deliberately and page by page.
6. Add server-side validation for any trading operation.
7. Add integration tests and security review.

## 12. Instructions for Future ChatGPT or Claude Sessions

Before editing:

- Read this file.
- Inspect the current source because files may have changed since this document was written.
- Preserve the fake-data-only requirement.
- Do not assume the backend should be connected.
- Do not create a landing page without deciding the desired route behavior.
- Do not treat the existing Google login as complete.
- Check import paths from the importing file's directory.

While editing:

- Prefer small changes.
- Keep mock data in `src/lib/data.ts` unless a local feature needs a clearly named mock state layer.
- Use existing components and styling patterns.
- Avoid unrelated redesigns.
- Label simulated trading behavior clearly.
- Do not add real credentials or private data.

After editing:

```bash
cd /data/370project/Cse370grp11/frontend
npm run build
```

Then manually check the affected route in the browser. A successful build only proves compilation and bundling; it does not prove that buttons, authentication, filtering, or data behavior are complete.

## Final Current-State Summary

TradeSphere currently has a substantial dashboard UI with working local rendering, navigation, local market search, local calculations, theme switching, and a simulated order ticket. It does not currently have a landing page, a reachable/correct login flow, real authentication state, protected routes, persistent settings, complete interactive controls, or a real data integration.

The most important constraint is that the frontend must continue using fake data only. Backend files and endpoint comments are future planning references, not permission to fetch real data. The immediate work is to fix imports, correct the login experience locally, decide the landing-page behavior, and finish the local demo interactions.
