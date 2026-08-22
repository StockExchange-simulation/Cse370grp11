import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, ChartNoAxesCombined, CircleDollarSign, ShoppingCart } from 'lucide-react'
import { Card, Eyebrow, PageTitle, PrimaryButton, AssetMark, StatusBadge } from '../components/ui'
import { findStock, usd } from '../lib/data'

export function StockDetail() {
  const { symbol = '' } = useParams()
  const navigate = useNavigate()
  const stock = findStock(symbol)

  return (
    <>
      <button type="button" onClick={() => navigate(-1)} className="mb-5 inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-ink">
        <ArrowLeft size={14} /> Back
      </button>

      <PageTitle
        eyebrow="Stock overview"
        title={stock.symbol}
        subtitle={stock.companyName}
        action={<PrimaryButton onClick={() => navigate(`/trade/${stock.symbol}`)}><ShoppingCart size={16} /> Buy {stock.symbol}</PrimaryButton>}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <Eyebrow>Current price</Eyebrow>
              <div className="mt-2 flex items-baseline gap-3">
                <strong className="text-3xl font-bold tracking-tight text-ink">{usd(stock.currentPrice)}</strong>
                <span className={`text-xs font-bold ${stock.changePct >= 0 ? 'text-teal' : 'text-danger'}`}>
                  {stock.changePct >= 0 ? '+' : ''}{stock.changePct.toFixed(2)}% today
                </span>
              </div>
            </div>
            <ChartNoAxesCombined className="text-accent" size={20} />
          </div>
          <div className="mt-6 flex h-48 items-end gap-1 rounded-lg bg-canvas px-3 pb-3 pt-5">
            {stock.priceHistory.map((point, index) => (
              <div key={`${point.label}-${index}`} className="group flex h-full flex-1 flex-col justify-end gap-1">
                <div title={`${point.label}: ${usd(point.price)}`} className="w-full rounded-t-sm bg-accent/75 transition hover:bg-accent" style={{ height: `${Math.max(12, (point.price / Math.max(...stock.priceHistory.map((item) => item.price))) * 100)}%` }} />
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between text-[10px] text-muted"><span>{stock.priceHistory[0]?.label}</span><span>Price history</span><span>{stock.priceHistory[stock.priceHistory.length - 1]?.label}</span></div>
        </Card>

        <Card>
          <Eyebrow>Company profile</Eyebrow>
          <div className="mt-3 flex items-center gap-3"><AssetMark symbol={stock.symbol} /><div><h2 className="text-base font-semibold text-ink">{stock.companyName}</h2><p className="text-xs text-muted">{stock.industry}</p></div></div>
          <p className="mt-5 text-sm leading-6 text-muted">{stock.description}</p>
          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5">
            <div><dt className="text-[10px] uppercase tracking-wider text-muted">Total shares</dt><dd className="mt-1 text-sm font-semibold text-ink">{stock.totalShares.toLocaleString()}</dd></div>
            <div><dt className="text-[10px] uppercase tracking-wider text-muted">Exchange</dt><dd className="mt-1 text-sm font-semibold text-ink">NASDAQ</dd></div>
          </dl>
        </Card>
      </div>

      <Card className="mt-4">
        <div className="flex items-start justify-between"><div><Eyebrow>Shareholder income</Eyebrow><h2 className="text-[17px] font-semibold tracking-tight">Dividends</h2></div><CircleDollarSign size={19} className="text-violet" /></div>
        {stock.dividends.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{stock.dividends.map((dividend) => <div key={dividend.date} className="rounded-lg border border-line bg-canvas p-4"><div className="flex items-center justify-between"><span className="text-sm font-semibold text-ink">{usd(dividend.perShare)} / share</span><StatusBadge status={dividend.status} /></div><p className="mt-2 flex items-center gap-1.5 text-xs text-muted"><CalendarDays size={13} /> {dividend.date}</p></div>)}</div> : <p className="mt-4 text-sm text-muted">No dividends have been declared for this stock.</p>}
      </Card>
    </>
  )
}
