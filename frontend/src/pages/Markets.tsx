import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { MarketTable } from '../components/MarketTable'
import { Card, PageTitle, LiveDot } from '../components/ui'
import { marketRows, watchlistSymbols } from '../lib/data'

export function Markets({ watchlistOnly = false }: { watchlistOnly?: boolean }) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  // TODO FastAPI: GET /api/markets (or /api/watchlist). Debounce `query` and
  // send it as a server-side search param instead of filtering on the client.
  const rows = useMemo(() => {
    const base = watchlistOnly
      ? marketRows.filter((r) => watchlistSymbols.includes(r.symbol))
      : marketRows
    const q = query.trim().toLowerCase()
    if (!q) return base
    return base.filter(
      (r) => r.symbol.toLowerCase().includes(q) || r.name.toLowerCase().includes(q),
    )
  }, [query, watchlistOnly])

  return (
    <>
      <PageTitle
        eyebrow="TradeSphere"
        title={watchlistOnly ? 'Watchlist' : 'Markets'}
        subtitle="Track prices, discover opportunities, and make your next move."
        action={
          <div className="flex w-full items-center gap-2.5 rounded-lg border border-transparent bg-surface px-3 py-2.5 text-muted focus-within:border-accent/40 sm:w-auto">
            <Search size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search symbols"
              className="w-full border-0 bg-transparent text-[13px] text-ink outline-none placeholder:text-muted"
            />
          </div>
        }
      />

      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.11em] text-accent">
              US equities
            </p>
            <h2 className="text-[17px] font-semibold tracking-tight">
              {watchlistOnly ? 'Your saved assets' : 'Market overview'}
            </h2>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-muted">
            <LiveDot /> Market open
          </span>
        </div>
        <MarketTable
          rows={rows}
          onAction={(symbol) => navigate(`/trade/${symbol}`)}
          onSymbolClick={(symbol) => navigate(`/stock/${symbol}`)}
        />
      </Card>
    </>
  )
}
