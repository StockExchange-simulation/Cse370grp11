import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet, PieChart, TrendingUp, Plus, TrendingDown } from "lucide-react";
import { StatCard } from "../components/StatCard";
import { Card, PageTitle, PrimaryButton, AssetMark } from "../components/ui";
import { usd, pct } from "../lib/data";

export function Portfolio() {
  const navigate = useNavigate();

  type Holding = {
    symbol: string;
    name: string;
    shares: number;
    avgCost: number;
    price: number;
  };

  const [holdings, setHoldings] = useState<Holding[]>([]);

  useEffect(() => {
    loadHoldings();
  }, []);

  async function loadHoldings() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/portfolio/holdings`,
        { credentials: "include" },
      );
      const data = await res.json();
      setHoldings(data);
    } catch (error) {
      console.error("Failed to load holdings:", error);
    }
  }
  const marketValue = holdings.reduce((s, h) => s + h.shares * h.price, 0);
  const invested = holdings.reduce((s, h) => s + h.shares * h.avgCost, 0);
  const gain = marketValue - invested;
  const gainPct = (gain / invested) * 100;

  return (
    <>
      <PageTitle
        eyebrow="Long-term view"
        title="Portfolio"
        subtitle="Your holdings at a glance."
        action={
          <PrimaryButton onClick={() => navigate("/markets")}>
            <Plus size={16} /> Add investment
          </PrimaryButton>
        }
      />

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Market value"
          value={usd(marketValue)}
          detail="+$284.20 today"
          icon={Wallet}
        />
        <StatCard
          label="Invested"
          value={usd(invested)}
          detail={`${holdings.length} positions`}
          icon={PieChart}
          tone="teal"
        />
        <StatCard
          label="Unrealized gain"
          value={`+${usd(gain)}`}
          detail={`${pct(gainPct)} return`}
          icon={TrendingUp}
          tone="violet"
        />
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-semibold tracking-tight">Holdings</h2>
          <span className="text-xs text-muted">{holdings.length} assets</span>
        </div>
        <div className="scrollbar-thin mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse">
            <thead>
              <tr>
                {[
                  "Asset",
                  "Shares",
                  "Avg cost",
                  "Price",
                  "Market value",
                  "Return",
                  "Action",
                ].map((h, i) => (
                  <th
                    key={h}
                    className={`px-2.5 pb-3 text-[9px] font-extrabold uppercase tracking-[0.08em] text-muted/80 first:pl-0 last:pr-0 ${
                      i === 0 ? "text-left" : "text-right"
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {holdings.map((h) => {
                const value = h.shares * h.price;
                const rtn = ((h.price - h.avgCost) / h.avgCost) * 100;
                return (
                  <tr key={h.symbol} className="text-xs">
                    <td className="border-t border-line/60 px-2.5 py-3 pl-0">
                      <div className="flex items-center gap-2.5">
                        <AssetMark symbol={h.symbol} />
                        <span className="flex flex-col">
                          <button
                            type="button"
                            onClick={() => navigate(`/stock/${h.symbol}`)}
                            className="w-fit font-bold text-ink hover:text-accent hover:underline"
                          >
                            {h.symbol}
                          </button>
                          <small className="text-[10px] text-muted">
                            {h.name}
                          </small>
                        </span>
                      </div>
                    </td>
                    <td className="border-t border-line/60 px-2.5 py-3 text-right text-ink">
                      {h.shares}
                    </td>
                    <td className="border-t border-line/60 px-2.5 py-3 text-right text-muted">
                      {usd(h.avgCost)}
                    </td>
                    <td className="border-t border-line/60 px-2.5 py-3 text-right text-ink">
                      {usd(h.price)}
                    </td>
                    <td className="border-t border-line/60 px-2.5 py-3 text-right font-semibold text-ink">
                      {usd(value)}
                    </td>
                    <td
                      className={`border-t border-line/60 px-2.5 py-3 text-right font-semibold ${rtn >= 0 ? "text-teal" : "text-danger"}`}
                    >
                      {pct(rtn)}
                    </td>
                    <td className="border-t border-line/60 px-2.5 py-3 pr-0 text-right">
                      <button
                        type="button"
                        onClick={() => navigate(`/sell/${h.symbol}`)}
                        className="inline-flex items-center gap-1.5 rounded-md border border-danger/30 px-2.5 py-1.5 text-[11px] font-semibold text-danger transition hover:bg-danger/10"
                      >
                        <TrendingDown size={13} /> Sell
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
