import { useNavigate } from "react-router-dom";
import { Wallet, Banknote, TrendingUp, Plus, ArrowRight } from "lucide-react";
import { StatCard } from "../components/StatCard";
import { PerformanceChart } from "../components/PerformanceChart";
import { MarketTable } from "../components/MarketTable";
import {
  Card,
  Eyebrow,
  OutlineButton,
  AssetMark,
  StatusBadge,
} from "../components/ui";
import {
  marketRows,
  orders,
  watchlistSymbols,
  portfolioSeries,
  currentUser,
  usd,
} from "../lib/data";

export function Dashboard() {
  const navigate = useNavigate();
  // TODO FastAPI: this whole screen should hydrate from GET /api/dashboard
  // (portfolio summary + watchlist + recent orders) for the logged-in user.
  const watchlist = marketRows.filter((r) =>
    watchlistSymbols.includes(r.symbol),
  );

  return (
    <>
      <div className="mb-7 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Eyebrow>Tuesday, August 20, 2026</Eyebrow>
          <h1 className="text-[clamp(25px,3vw,32px)] font-bold leading-tight tracking-tight">
            Good morning, {currentUser.name.split(" ")[0]}
          </h1>
          <p className="mt-2 text-sm text-muted">
            Here is your market overview for today.
          </p>
        </div>
        <OutlineButton onClick={() => navigate("/markets")}>
          <Plus size={16} /> Explore markets
        </OutlineButton>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Portfolio value"
          value="$12,840.56"
          detail="+$284.20 (2.26%) today"
          icon={Wallet}
        />
        <StatCard
          label="Available cash"
          value="$4,250.00"
          detail="Ready to invest"
          icon={Banknote}
          tone="teal"
        />
        <StatCard
          label="Total return"
          value="+$1,840.56"
          detail="+16.72% all time"
          icon={TrendingUp}
          tone="violet"
        />
      </div>

      <div className="mb-4 grid grid-cols-1 items-stretch gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(290px,0.9fr)]">
        <Card>
          <div className="flex items-start justify-between gap-3">
            <div>
              <Eyebrow>Your portfolio</Eyebrow>
              <h2 className="text-[17px] font-semibold tracking-tight">
                Performance
              </h2>
            </div>
            <select className="rounded-md border border-line bg-canvas px-2.5 py-2 text-xs text-ink outline-none">
              <option>6 months</option>
              <option>1 year</option>
              <option>All time</option>
            </select>
          </div>
          <div className="my-5 flex items-center gap-4">
            <strong className="text-[26px] font-bold tracking-tight">
              $12,840.56
            </strong>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-teal">
              <TrendingUp size={15} /> +16.72%
            </span>
          </div>
          <PerformanceChart series={portfolioSeries} />
        </Card>

        <Card>
          <div className="flex items-start justify-between gap-3">
            <div>
              <Eyebrow>Latest activity</Eyebrow>
              <h2 className="text-[17px] font-semibold tracking-tight">
                Recent orders
              </h2>
            </div>
            <button
              onClick={() => navigate("/orders")}
              className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline"
            >
              View all <ArrowRight size={14} />
            </button>
          </div>
          <div className="mt-3">
            {orders.slice(0, 4).map((order) => (
              <div
                key={order.id}
                className="flex items-center gap-2.5 border-b border-line/60 py-3 last:border-0"
              >
                <AssetMark symbol={order.symbol} />
                <div className="flex flex-1 flex-col">
                  <b className="text-xs text-ink">
                    {order.side} {order.symbol}
                  </b>
                  <small className="text-[10px] text-muted">
                    {order.shares} shares · {order.date}
                  </small>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-semibold text-ink">
                    {usd(order.total)}
                  </span>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card>
          <div className="flex items-start justify-between gap-3">
            <div>
              <Eyebrow>Keep an eye on it</Eyebrow>
              <h2 className="text-[17px] font-semibold tracking-tight">
                Watchlist
              </h2>
            </div>
            <button
              onClick={() => navigate("/watchlist")}
              className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline"
            >
              View all <ArrowRight size={14} />
            </button>
          </div>
          <MarketTable
            rows={watchlist}
            actionLabel="View"
            onAction={() => navigate("/markets")}
          />
        </Card>
      </div>
    </>
  );
}
