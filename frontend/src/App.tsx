import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Markets } from './pages/Markets'
import { Portfolio } from './pages/Portfolio'
import { Activity } from './pages/Activity'
import { Profile } from './pages/Profile'
import { Admin } from './pages/Admin'
import { Settings } from './pages/Settings'
import { BuyOrder } from './pages/BuyOrder'
import { SellOrder } from './pages/SellOrder'
import { StockDetail } from './pages/StockDetail'

/*
  App routing. Every page lives under the AppShell layout (top bar + sidebar).

  >>> BACKEND / AUTH NOTE <<<
  This build assumes the user is already authenticated. To add auth:
    1. Create a login route (email + password) that calls api.login().
    2. Wrap the protected routes below in an <RequireAuth> guard that checks
       the session (GET /api/me) and redirects to /login when missing.
    3. Gate the /admin route on the user's role (checked server-side too).
*/
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route element={<AppShell />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="markets" element={<Markets />} />
        <Route path="trade/:symbol" element={<BuyOrder />} />
        <Route path="sell/:symbol" element={<SellOrder />} />
        <Route path="stock/:symbol" element={<StockDetail />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="orders" element={<Activity kind="orders" />} />
        <Route path="transactions" element={<Activity kind="transactions" />} />
        <Route path="watchlist" element={<Markets watchlistOnly />} />
        <Route path="dividends" element={<Activity kind="dividends" />} />
        <Route path="profile" element={<Profile />} />
        <Route path="admin" element={<Admin />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
