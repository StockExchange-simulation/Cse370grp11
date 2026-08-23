import { useEffect, useState } from "react";
import { Card, PageTitle, AssetMark, StatusBadge } from "../components/ui";
import { usd } from "../lib/data";

type Kind = "orders" | "transactions" | "dividends";

const titles: Record<Kind, string> = {
  orders: "Orders",
  transactions: "Transactions",
  dividends: "Dividends",
};

export function Activity({ kind }: { kind: Kind }) {
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
        </div>

        <div className="scrollbar-thin mt-4 overflow-x-auto">
          {kind === "orders" ? <OrdersTable /> : null}
          {kind === "transactions" ? <TransactionsTable /> : null}
          {kind === "dividends" ? <DividendsTable /> : null}
        </div>
      </Card>
    </>
  );
}

// TODO FastAPI: GET /api/orders (user-scoped, paginated, filterable).
function OrdersTable() {
  const [orders, setOrders] = useState<
    {
      id: number
      side: string
      symbol: string
      shares: number
      date: string
      total: number
      status: string
    }[]
  >([])

  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 10
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  useEffect(() => {
    loadOrders()
  }, [page])

  async function loadOrders() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/all?page=${page}&page_size=${pageSize}`,
        { credentials: 'include' }
      )
      const data = await res.json()
      setOrders(data.items)
      setTotalCount(data.total_count)
    } catch (error) {
      console.error('Failed to load orders:', error)
    }
  }

  return (
    <>
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
                <span className={o.side.toLowerCase() === 'buy' ? 'text-teal' : 'text-danger'}>
                  {o.side.charAt(0).toUpperCase() + o.side.slice(1)}
                </span>
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

      {totalPages > 1 ? (
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`rounded-md px-3 py-1.5 text-xs font-bold transition ${
                page === p ? 'bg-accent text-white' : 'bg-canvas text-muted hover:text-ink'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      ) : null}
    </>
  )
}
// TODO FastAPI: GET /api/transactions (user-scoped).
function TransactionsTable() {
  const [transactions, setTransactions] = useState<
    {
      id: number;
      type: string;
      description: string;
      amount: number;
      date: string;
      status: string;
    }[]
  >([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/transactions`,
        { credentials: "include" },
      );
      const data = await res.json();
      setTransactions(data);
    } catch (error) {
      console.error("Failed to load transactions:", error);
    }
  }

  return (
    <table className="w-full min-w-[520px] border-collapse">
      <TableHead cols={["Type", "Description", "Amount", "Date", "Status"]} />
      <tbody>
        {transactions.map((t) => (
          <tr key={t.id} className="text-xs">
            <Td first>
              <b className="text-ink">{t.type}</b>
            </Td>
            <Td>{t.description}</Td>
            <Td>
              <span className={t.amount >= 0 ? "text-teal" : "text-ink"}>
                {t.amount >= 0 ? "+" : ""}
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
  );
}

function DividendsTable() {
  const [dividends, setDividends] = useState<
    {
      id: number
      symbol: string
      perShare: number
      amount: number
      payDate: string
      status: string
    }[]
  >([])

  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 10
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  useEffect(() => {
    loadDividends()
  }, [page])

  async function loadDividends() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/dividends/upcoming?page=${page}&page_size=${pageSize}`,
        { credentials: 'include' }
      )
      const data = await res.json()
      setDividends(data.items)
      setTotalCount(data.total_count)
    } catch (error) {
      console.error('Failed to load dividends:', error)
    }
  }

  return (
    <>
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

      {totalPages > 1 ? (
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`rounded-md px-3 py-1.5 text-xs font-bold transition ${
                page === p ? 'bg-accent text-white' : 'bg-canvas text-muted hover:text-ink'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      ) : null}
    </>
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
              i === cols.length - 1 ? "text-right" : "text-left"
            }`}
          >
            {c}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function Td({
  children,
  first,
  last,
}: {
  children: React.ReactNode;
  first?: boolean;
  last?: boolean;
}) {
  return (
    <td
      className={`border-t border-line/60 px-2.5 py-3 text-muted ${
        first ? "pl-0" : ""
      } ${last ? "pr-0 text-right" : ""}`}
    >
      {children}
    </td>
  );
}
