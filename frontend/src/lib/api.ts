/*
  ============================================================================
  API CLIENT (stub) — wire this to your FastAPI backend
  ============================================================================
  This file is intentionally not used by the UI yet. It shows the intended
  shape of the integration so you can drop in real calls without restructuring
  the components.

  SETUP
  -----
  1. Add a `.env` file with:
        VITE_API_URL=http://localhost:8000
     (Vite exposes any var prefixed with VITE_ via import.meta.env.)

  2. Auth: the UI uses Google-only login. Your FastAPI OAuth callback should
     create an httpOnly session cookie, then every request below sends it via
     `credentials: 'include'`. Add an Authorization header only if your backend
     uses bearer tokens instead of cookies.

  3. Replace the mock imports in each page (see src/lib/data.ts) with calls to
     these functions, ideally through a data hook (SWR/TanStack Query).
  ============================================================================
*/

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    // TODO FastAPI: keep this if you authenticate with httpOnly session cookies.
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (!res.ok) {
    // TODO: surface a friendly error / redirect to login on 401.
    throw new Error(`API ${res.status}: ${res.statusText}`)
  }

  return res.json() as Promise<T>
}

export const api = {
  // TODO FastAPI: GET /api/markets
  getMarkets: () => request('/api/markets'),

  // TODO FastAPI: GET /api/portfolio
  getPortfolio: () => request('/api/portfolio'),

  // TODO FastAPI: GET /api/orders
  getOrders: () => request('/api/orders'),

  // TODO FastAPI: POST /api/orders
  // IMPORTANT: validate price, balance, permissions, and quantity SERVER-SIDE.
  // Recompute the total from the server-side price. Use an idempotency key so a
  // retry cannot place a duplicate order.
  placeOrder: (body: { symbol: string; side: 'Buy' | 'Sell'; quantity: number; type: string }) =>
    request('/api/orders', { method: 'POST', body: JSON.stringify(body) }),

  // BACKEND: start the Google OAuth redirect from the login page.
  // FastAPI should return a callback URL or redirect directly to Google.
  loginWithGoogle: () => `${BASE_URL}/auth/google`,

  // BACKEND: POST /auth/logout clears the httpOnly session cookie.
  // Keep the call even if the UI redirects locally after a network failure.
  // TODO FastAPI: POST /auth/logout
  logout: () => request('/auth/logout', { method: 'POST' }),
}
