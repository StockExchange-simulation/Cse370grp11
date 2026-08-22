import { useState } from 'react'
import { Card, PageTitle, AssetMark, StatusBadge } from '../components/ui'
import { orders, transactions, dividends, usd } from '../lib/data'

type Kind = 'orders' | 'transactions' | 'dividends'

const titles: Record<Kind, string> = {
  orders: 'Orders',
  transactions: 'Transactions',
  dividends: 'Dividends',
}

export function Activity({ kind }: { kind: Kind }) {
  const [filter, setFilter] = useState<'All' | 'This month'>('All')

  return (
    <>
      <PageTitle
        eyebrow="Account activity"
        title={titles[kind]}
        subtitle={`Review your ${kind} and account history.`}
      />

      <Card>
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <h2 className="text-[17px] font-semibold tracking-tight capitalize">
            Recent {kind}
          </h2>
          <div className="flex gap-1 rounded-lg bg-canvas p-1">
            {(['All', 'This month'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-md px-3 py-1.5 text-xs font-bold transition ${
                  filter === f ? 'bg-surface text-ink shadow-sm' : 'text-muted'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="scrollbar-thin mt-4 overflow-x-auto">
          {kind === 'orders' ? <OrdersTable /> : null}
          {kind === 'transactions' ? <TransactionsTable /> : null}
          {kind === 'dividends' ? <DividendsTable /> : null}
        </div>
      </Card>
    </>
  )
}

// TODO FastAPI: GET /api/orders (user-scoped, paginated, filterable).
function OrdersTable() {
  return (
    <table className="w-full min-w-[520px] border-collapse">
      <TableHead cols={['Asset', 'Side', 'Shares', 'Total', 'Date', 'Status']} />
      <tbody>
        {orders.map((o) => (
          <tr key={o.id} className="text-xs">
            <Td first>
              <div className="flex items-center gap-2.5">
                <AssetMark symbol={o.symbol} />
                <b className="text-ink">{o.symbol}</b>
              </div>
            </Td>
            <Td>
              <span className={o.side === 'Buy' ? 'text-teal' : 'text-danger'}>{o.side}</span>
            </Td>
            <Td>{o.shares}</Td>
            <Td>{usd(o.total)}</Td>
            <Td>{o.date}</Td>
            <Td last>
              <StatusBadge status={o.status} />
            </Td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// TODO FastAPI: GET /api/transactions (user-scoped).
function TransactionsTable() {
  return (
    <table className="w-full min-w-[520px] border-collapse">
      <TableHead cols={['Type', 'Description', 'Amount', 'Date', 'Status']} />
      <tbody>
        {transactions.map((t) => (
          <tr key={t.id} className="text-xs">
            <Td first>
              <b className="text-ink">{t.type}</b>
            </Td>
            <Td>{t.description}</Td>
            <Td>
              <span className={t.amount >= 0 ? 'text-teal' : 'text-ink'}>
                {t.amount >= 0 ? '+' : ''}
                {usd(t.amount)}
              </span>
            </Td>
            <Td>{t.date}</Td>
            <Td last>
              <StatusBadge status={t.status} />
            </Td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// TODO FastAPI: GET /api/dividends (user-scoped).
function DividendsTable() {
  return (
    <table className="w-full min-w-[520px] border-collapse">
      <TableHead cols={['Asset', 'Per share', 'Amount', 'Pay date', 'Status']} />
      <tbody>
        {dividends.map((d) => (
          <tr key={d.id} className="text-xs">
            <Td first>
              <div className="flex items-center gap-2.5">
                <AssetMark symbol={d.symbol} />
                <b className="text-ink">{d.symbol}</b>
              </div>
            </Td>
            <Td>{usd(d.perShare)}</Td>
            <Td>
              <span className="text-teal">+{usd(d.amount)}</span>
            </Td>
            <Td>{d.payDate}</Td>
            <Td last>
              <StatusBadge status={d.status} />
            </Td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function TableHead({ cols }: { cols: string[] }) {
  return (
    <thead>
      <tr>
        {cols.map((c, i) => (
          <th
            key={c}
            className={`px-2.5 pb-3 text-[9px] font-extrabold uppercase tracking-[0.08em] text-muted/80 first:pl-0 last:pr-0 ${
              i === cols.length - 1 ? 'text-right' : 'text-left'
            }`}
          >
            {c}
          </th>
        ))}
      </tr>
    </thead>
  )
}

function Td({
  children,
  first,
  last,
}: {
  children: React.ReactNode
  first?: boolean
  last?: boolean
}) {
  return (
    <td
      className={`border-t border-line/60 px-2.5 py-3 text-muted ${
        first ? 'pl-0' : ''
      } ${last ? 'pr-0 text-right' : ''}`}
    >
      {children}
    </td>
  )
}
