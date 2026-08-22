import { useState } from 'react'
import { Info, CheckCircle2 } from 'lucide-react'
import { findMarket, usd } from '../lib/data'
import { AssetMark, Card, LiveDot, PrimaryButton } from './ui'

type Side = 'Buy' | 'Sell'

export function OrderTicket({ symbol = 'AAPL' }: { symbol?: string }) {
  const [side, setSide] = useState<Side>('Buy')
  const [quantity, setQuantity] = useState('10')
  const [orderType, setOrderType] = useState('Market order')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const selected = findMarket(symbol)
  const qty = Number(quantity)
  const validQuantity = Number.isInteger(qty) && qty > 0
  const total = validQuantity ? qty * selected.price : 0

  function handleSubmit() {
    setError('')
    setSubmitted(false)

    if (!validQuantity) {
      setError('Enter a whole number of shares greater than 0.')
      return
    }

    // TODO FastAPI: replace this demo completion with api.placeOrder({
    // symbol, side, quantity: qty, type: orderType }) and send an idempotency
    // key. The server must validate balance, holdings, permissions, price,
    // and quantity, then recompute the total from the live server price.
    setSubmitted(true)
  }

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.11em] text-accent">
            Quick trade
          </p>
          <h2 className="text-[19px] font-semibold tracking-tight text-ink">
            Place an order
          </h2>
        </div>
        <span className="flex items-center gap-1.5 whitespace-nowrap text-xs text-muted">
          <LiveDot /> Market open
        </span>
      </div>

      <div className="my-5 flex items-center gap-3">
        <AssetMark symbol={selected.symbol} large />
        <div className="flex flex-col">
          <b className="text-sm text-ink">{selected.symbol}</b>
          <small className="text-[10px] text-muted">{selected.name}</small>
        </div>
        <strong className="ml-auto text-lg text-ink">{usd(selected.price)}</strong>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-1 rounded-lg bg-canvas p-1">
        {(['Buy', 'Sell'] as Side[]).map((s) => {
          const active = side === s
          return (
            <button
              key={s}
              type="button"
              onClick={() => setSide(s)}
              className={`rounded-md py-2 text-xs font-bold transition ${
                active
                  ? `bg-surface shadow-sm ${s === 'Sell' ? 'text-danger' : 'text-teal'}`
                  : 'text-muted'
              }`}
            >
              {s}
            </button>
          )
        })}
      </div>

      <label className="mb-3 flex flex-col gap-1.5 text-[11px] text-muted">
        <span>Order type</span>
        <select
          value={orderType}
          onChange={(e) => setOrderType(e.target.value)}
          className="w-full rounded-md border border-line bg-canvas px-2.5 py-2 text-xs text-ink outline-none focus:border-accent"
        >
          <option>Market order</option>
          <option>Limit order</option>
        </select>
      </label>

      <label className="mb-3 flex flex-col gap-1.5 text-[11px] text-muted">
        <span>Quantity</span>
        <input
          value={quantity}
          onChange={(e) => {
            setQuantity(e.target.value)
            setSubmitted(false)
            setError('')
          }}
          inputMode="numeric"
          min="1"
          step="1"
          aria-invalid={Boolean(error)}
          className="w-full rounded-md border border-line bg-canvas px-2.5 py-2 text-xs text-ink outline-none focus:border-accent aria-[invalid=true]:border-danger"
        />
      </label>

      <div className="mt-4 flex items-center justify-between border-t border-line py-4 text-xs text-muted">
        <span>Estimated total</span>
        <b className="text-sm text-ink">{usd(total)}</b>
      </div>

      {error ? (
        <p role="alert" className="mb-3 rounded-md bg-danger/10 px-3 py-2 text-[11px] font-medium text-danger">
          {error}
        </p>
      ) : null}

      {submitted ? (
        <div role="status" className="mb-3 flex items-start gap-2 rounded-md bg-teal/10 px-3 py-2 text-[11px] text-teal">
          <CheckCircle2 size={15} className="mt-px shrink-0" />
          <span>{side} order for {qty} {selected.symbol} shares submitted successfully.</span>
        </div>
      ) : null}

      <PrimaryButton
        tone={side === 'Sell' ? 'danger' : 'accent'}
        onClick={handleSubmit}
        className="w-full"
      >
        {submitted ? 'Place another order' : `${side} ${selected.symbol}`}
      </PrimaryButton>

      <p className="mt-3 flex gap-1.5 text-[10px] leading-relaxed text-muted/80">
        <Info size={14} className="mt-px shrink-0" />
        Trading is simulated. Connect your FastAPI order endpoint to enable live
        execution.
      </p>
    </Card>
  )
}
