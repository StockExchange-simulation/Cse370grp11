# TradeSphere frontend

The frontend is a Vite React application. For complete database, Google OAuth, backend, and frontend setup, see the [project README](../README.md).

## Local development

From this directory:

```bash
cp .env.example .env
pnpm install
pnpm dev
```

The development server runs at http://localhost:5173. Set `VITE_API_URL` to the URL of the FastAPI server and set `VITE_GOOGLE_CLIENT_ID` to the Google Web client ID configured for the backend.

## Scripts

```bash
pnpm dev       # Start Vite with hot reload
pnpm build     # Type-check and create a production build
pnpm preview   # Serve the production build locally
```

Do not put private credentials in `VITE_*` variables. Vite exposes these values to browser code at build time.
