/*
  ============================================================================
  MOCK DATA + API INTEGRATION LAYER
  ============================================================================
  Everything below is static demo data so the frontend renders on its own.

  >>> BACKEND (FastAPI + PostgreSQL) <<<
  Replace the exported constants with real API calls. A clean approach:

    1. Create an API client (see `src/lib/api.ts`) that points at your
       FastAPI base URL (import.meta.env.VITE_API_URL).
    2. Fetch data inside a data-fetching hook (SWR / TanStack Query) or a
       route loader, then pass it down as props.
    3. Keep the TypeScript types below — have FastAPI's Pydantic responses
       match these shapes so the UI needs no changes.

  Each screen notes exactly which endpoint should feed it.
  ============================================================================
*/

export type MarketRow = {
  symbol: string
  name: string
  price: number
  changePct: number
  volume: string
}

export type StockDetail = {
  symbol: string
  companyName: string
  industry: string
  description: string
  currentPrice: number
  changePct: number
  totalShares: number
  priceHistory: { label: string; price: number }[]
  dividends: { date: string; perShare: number; status: 'Paid' | 'Upcoming' }[]
}

export type OrderRow = {
  id: string
  symbol: string
  side: 'Buy' | 'Sell'
  shares: number
  price: number
  total: number
  status: 'Filled' | 'Pending' | 'Cancelled'
  date: string
}

export type Holding = {
  symbol: string
  name: string
  shares: number
  avgCost: number
  price: number
}

export type TransactionRow = {
  id: string
  type: 'Deposit' | 'Withdrawal' | 'Buy' | 'Sell' | 'Dividend'
  description: string
  amount: number
  date: string
  status: 'Completed' | 'Pending'
}

export type DividendRow = {
  id: string
  symbol: string
  amount: number
  perShare: number
  payDate: string
  status: 'Paid' | 'Upcoming'
}

// TODO FastAPI: GET /api/markets  -> list of tradable instruments + live quotes.
export const marketRows: MarketRow[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 213.07, changePct: 1.82, volume: '42.8M' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 138.85, changePct: 4.16, volume: '68.2M' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 418.79, changePct: -0.48, volume: '19.6M' },
  { symbol: 'TSLA', name: 'Tesla, Inc.', price: 342.03, changePct: 2.71, volume: '91.1M' },
  { symbol: 'AMZN', name: 'Amazon.com, Inc.', price: 226.63, changePct: -1.12, volume: '31.7M' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 174.92, changePct: 0.94, volume: '22.4M' },
  { symbol: 'META', name: 'Meta Platforms', price: 592.4, changePct: 2.08, volume: '15.1M' },
]

// TODO FastAPI: GET /api/watchlist  (user-scoped) -> symbols the user follows.
export const watchlistSymbols = ['AAPL', 'NVDA', 'TSLA', 'META', 'AMZN']

// TODO FastAPI: GET /api/stocks/{symbol} -> company profile, price history,
// and dividend declarations for the selected instrument.
export const stockDetails: StockDetail[] = marketRows.map((market, index) => ({
  symbol: market.symbol,
  companyName: market.name,
  industry: ['Technology', 'Semiconductors', 'Software', 'Automotive', 'E-commerce', 'Internet Services', 'Social Media'][index],
  description: `${market.name} is a publicly traded company listed on the NASDAQ exchange. Connect this demo profile to your FastAPI company record for the full business description and investor information.`,
  currentPrice: market.price,
  changePct: market.changePct,
  totalShares: [15340000000, 24500000000, 7440000000, 3180000000, 10600000000, 12100000000, 2520000000][index],
  priceHistory: [
    { label: 'May 1', price: market.price * 0.82 },
    { label: 'May 15', price: market.price * 0.88 },
    { label: 'Jun 1', price: market.price * 0.85 },
    { label: 'Jun 15', price: market.price * 0.93 },
    { label: 'Jul 1', price: market.price * 0.91 },
    { label: 'Jul 15', price: market.price * 0.97 },
    { label: 'Aug 1', price: market.price * 0.95 },
    { label: 'Today', price: market.price },
  ],
  dividends: ['AAPL', 'MSFT', 'AMZN'].includes(market.symbol)
    ? [{ date: 'Nov 12, 2026', perShare: market.symbol === 'MSFT' ? 3 : 0.25, status: 'Upcoming' as const }]
    : [],
}))

export const findStock = (symbol: string) =>
  stockDetails.find((stock) => stock.symbol.toUpperCase() === symbol.toUpperCase()) ?? stockDetails[0]

// TODO FastAPI: GET /api/orders  (user-scoped) -> the user's order history.
export const orders: OrderRow[] = [
  { id: 'o1', symbol: 'AAPL', side: 'Buy', shares: 12, price: 211.4, total: 2536.8, status: 'Filled', date: 'Today, 10:42 AM' },
  { id: 'o2', symbol: 'NVDA', side: 'Sell', shares: 8, price: 136.22, total: 1089.76, status: 'Filled', date: 'Yesterday, 3:18 PM' },
  { id: 'o3', symbol: 'MSFT', side: 'Buy', shares: 5, price: 420.05, total: 2100.25, status: 'Pending', date: 'Yesterday, 11:07 AM' },
  { id: 'o4', symbol: 'TSLA', side: 'Buy', shares: 3, price: 338.9, total: 1016.7, status: 'Filled', date: 'Aug 18, 2:44 PM' },
  { id: 'o5', symbol: 'AMZN', side: 'Sell', shares: 6, price: 229.1, total: 1374.6, status: 'Cancelled', date: 'Aug 17, 9:31 AM' },
]

// TODO FastAPI: GET /api/portfolio/holdings  (user-scoped).
export const holdings: Holding[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', shares: 24, avgCost: 178.2, price: 213.07 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', shares: 30, avgCost: 96.4, price: 138.85 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', shares: 8, avgCost: 402.1, price: 418.79 },
  { symbol: 'TSLA', name: 'Tesla, Inc.', shares: 10, avgCost: 305.0, price: 342.03 },
  { symbol: 'META', name: 'Meta Platforms', shares: 5, avgCost: 540.7, price: 592.4 },
]

// TODO FastAPI: GET /api/transactions  (user-scoped).
export const transactions: TransactionRow[] = [
  { id: 't1', type: 'Deposit', description: 'Bank transfer', amount: 5000, date: 'Aug 20, 2026', status: 'Completed' },
  { id: 't2', type: 'Buy', description: 'AAPL · 12 shares', amount: -2536.8, date: 'Aug 20, 2026', status: 'Completed' },
  { id: 't3', type: 'Dividend', description: 'MSFT quarterly dividend', amount: 24.0, date: 'Aug 19, 2026', status: 'Completed' },
  { id: 't4', type: 'Sell', description: 'NVDA · 8 shares', amount: 1089.76, date: 'Aug 19, 2026', status: 'Completed' },
  { id: 't5', type: 'Withdrawal', description: 'To linked bank', amount: -800, date: 'Aug 15, 2026', status: 'Pending' },
]

// TODO FastAPI: GET /api/dividends  (user-scoped).
export const dividends: DividendRow[] = [
  { id: 'd1', symbol: 'MSFT', amount: 24.0, perShare: 3.0, payDate: 'Aug 19, 2026', status: 'Paid' },
  { id: 'd2', symbol: 'AAPL', amount: 6.0, perShare: 0.25, payDate: 'Aug 12, 2026', status: 'Paid' },
  { id: 'd3', symbol: 'AAPL', amount: 6.0, perShare: 0.25, payDate: 'Nov 12, 2026', status: 'Upcoming' },
]

// TODO FastAPI: GET /api/portfolio/history?period=6M -> chart series (value per day).
export const portfolioSeries = [
  10800, 11020, 10950, 11380, 11210, 11640, 11880, 12040, 11960, 12310, 12190,
  12440, 12680, 12580, 12840,
]

// TODO FastAPI: GET /api/me -> the authenticated user's profile.
export const currentUser = {
  name: 'Alex Smith',
  email: 'alex.smith@example.com',
  initials: 'AS',
  verified: true,
}

// ---------- formatting helpers ----------
export const usd = (n: number) =>
  n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

export const pct = (n: number) => `${n > 0 ? '+' : ''}${n.toFixed(2)}%`

export const findMarket = (symbol: string) =>
  marketRows.find((r) => r.symbol === symbol) ?? marketRows[0]
