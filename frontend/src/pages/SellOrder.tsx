import { useState } from 'react'
import { ArrowLeft, CheckCircle2, Info, TrendingDown } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Eyebrow, AssetMark, LiveDot, PrimaryButton } from '../components/ui'
import { findMarket, holdings, usd } from '../lib/data'

export function SellOrder() {
  const navigate = useNavigate()
  const { symbol = 'AAPL' } = useParams()
  const selected = findMarket(symbol.toUpperCase())
  const holding = holdings.find((item) => item.symbol === selected.symbol)
  const maxShares = holding?.shares ?? 0
  const [orderType, setOrderType] = useState<'Market order' | 'Limit order'>('Market order')
  const [quantity, setQuantity] = useState('1')
  const [limitPrice, setLimitPrice] = useState(String(selected.price.toFixed(2)))
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const qty = Number(quantity)
  const price = orderType === 'Limit order' ? Number(limitPrice) : selected.price
  const validQuantity = Number.isInteger(qty) && qty > 0 && qty <= maxShares
  const validPrice = orderType === 'Market order' || (Number.isFinite(price) && price > 0)
  const total = validQuantity && validPrice ? qty * price : 0

  function submitOrder() {
    setError('')
    setSubmitted(false)
    if (!Number.isInteger(qty) || qty <= 0) {
      setError('Enter a whole number of shares greater than 0.')
      return
    }
    if (qty > maxShares) {
      setError(`You can sell up to ${maxShares} shares of ${selected.symbol}.`)
      return
    }
    if (!validPrice) {
      setError('Enter a limit price greater than 0.')
      return
    }

    // TODO FastAPI: POST /api/orders with { symbol, side: 'sell', quantity,
    // type: orderType, limit_price: orderType === 'Limit order' ? price : null }.
    // Validate ownership, available shares, price, permissions, and quantity server-side.
    setSubmitted(true)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <button type="button" onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-muted transition hover:text-ink">
        <ArrowLeft size={16} /> Back to portfolio
      </button>

      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <Eyebrow>TradeSphere / Sell</Eyebrow>
          <h1 className="text-[clamp(25px,3vw,32px)] font-bold leading-tight tracking-tight">Sell {selected.symbol}</h1>
          <p className="mt-2 text-sm text-muted">Sell shares from your current portfolio holdings.</p>
        </div>
        <span className="hidden items-center gap-1.5 text-xs text-muted sm:flex"><LiveDot /> Market open</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="p-6">
          <div className="mb-7 flex items-center gap-3 border-b border-line pb-5">
            <AssetMark symbol={selected.symbol} large />
            <div><p className="text-sm font-bold text-ink">{selected.symbol}</p><p className="text-xs text-muted">{selected.name}</p></div>
            <div className="ml-auto text-right"><p className="text-lg font-bold text-ink">{usd(selected.price)}</p><p className={`text-xs font-semibold ${selected.changePct >= 0 ? 'text-teal' : 'text-danger'}`}>{selected.changePct >= 0 ? '+' : ''}{selected.changePct.toFixed(2)}%</p></div>
          </div>

          <div className="mb-6">
            <p className="mb-2 text-xs font-semibold text-ink">Order type</p>
            <div className="grid grid-cols-2 gap-2">
              {(['Market order', 'Limit order'] as const).map((type) => (
                <button key={type} type="button" onClick={() => { setOrderType(type); setSubmitted(false); setError('') }} className={`rounded-lg border px-3 py-3 text-left transition ${orderType === type ? 'border-danger bg-danger/10 text-danger' : 'border-line bg-canvas text-muted hover:border-danger/50'}`}>
                  <span className="block text-xs font-bold">{type}</span>
                  <span className="mt-1 block text-[10px] leading-relaxed opacity-80">{type === 'Market order' ? 'Executes at the current market price.' : 'Executes only at your chosen price or better.'}</span>
                </button>
              ))}
            </div>
          </div>

          <label className="mb-4 flex flex-col gap-2 text-xs font-semibold text-ink">Quantity <span className="font-normal text-muted">Available: {maxShares} shares</span>
            <input value={quantity} onChange={(e) => { setQuantity(e.target.value); setSubmitted(false); setError('') }} inputMode="numeric" min="1" max={maxShares} step="1" className="rounded-lg border border-line bg-canvas px-3 py-3 text-sm font-normal text-ink outline-none focus:border-danger" />
          </label>

          {orderType === 'Limit order' ? <label className="mb-4 flex flex-col gap-2 text-xs font-semibold text-ink">Limit price per share
            <div className="relative"><span className="pointer-events-none absolute left-3 top-3 text-sm text-muted">$</span><input value={limitPrice} onChange={(e) => { setLimitPrice(e.target.value); setSubmitted(false); setError('') }} inputMode="decimal" min="0.01" step="0.01" className="w-full rounded-lg border border-line bg-canvas py-3 pl-7 pr-3 text-sm font-normal text-ink outline-none focus:border-danger" /></div>
          </label> : null}

          <div className="mt-6 flex items-center justify-between border-t border-line pt-5 text-sm text-muted"><span>Estimated proceeds</span><strong className="text-lg text-ink">{usd(total)}</strong></div>
          {error ? <p role="alert" className="mt-4 rounded-lg bg-danger/10 px-3 py-2.5 text-xs font-medium text-danger">{error}</p> : null}
          {submitted ? <p role="status" className="mt-4 flex items-start gap-2 rounded-lg bg-teal/10 px-3 py-2.5 text-xs text-teal"><CheckCircle2 size={16} className="shrink-0" /> Sell order submitted successfully.</p> : null}
          <PrimaryButton tone="danger" onClick={submitOrder} className="mt-5 w-full"><TrendingDown size={16} /> {submitted ? 'Place another sell order' : `Sell ${selected.symbol}`}</PrimaryButton>
          <p className="mt-4 flex gap-2 text-[10px] leading-relaxed text-muted"><Info size={14} className="shrink-0" /> Trading is simulated until your FastAPI order endpoint is connected.</p>
        </Card>

        <Card className="h-fit p-6"><Eyebrow>Order summary</Eyebrow><h2 className="mt-1 text-lg font-semibold text-ink">Review before placing</h2><dl className="mt-6 space-y-4 text-xs"><div className="flex justify-between gap-3"><dt className="text-muted">Side</dt><dd className="font-bold text-danger">Sell</dd></div><div className="flex justify-between gap-3"><dt className="text-muted">Asset</dt><dd className="font-semibold text-ink">{selected.symbol}</dd></div><div className="flex justify-between gap-3"><dt className="text-muted">Order type</dt><dd className="font-semibold text-ink">{orderType}</dd></div><div className="flex justify-between gap-3"><dt className="text-muted">Quantity</dt><dd className="font-semibold text-ink">{validQuantity ? qty : '—'} shares</dd></div>{orderType === 'Limit order' ? <div className="flex justify-between gap-3"><dt className="text-muted">Limit price</dt><dd className="font-semibold text-ink">{validPrice ? usd(price) : '—'}</dd></div> : null}</dl></Card>
      </div>
    </div>
  )
}
