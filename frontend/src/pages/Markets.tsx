import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { MarketTable } from "../components/MarketTable";
import { Card, PageTitle, LiveDot } from "../components/ui";

export function Markets({
  watchlistOnly = false,
}: {
  watchlistOnly?: boolean;
}) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [watchlistRows, setWatchlistRows] = useState<
    {
      symbol: string;
      name: string;
      price: number;
      changePct: number;
      volume: string;
    }[]
  >([]);

  useEffect(() => {
    if (watchlistOnly) {
      loadWatchlist();
    }
  }, [watchlistOnly]);

  async function loadWatchlist() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/watchlist/all`,
        { credentials: "include" },
      );
      const data = await res.json();
      setWatchlistRows(data);
    } catch (error) {
      console.error("Failed to load watchlist:", error);
    }
  }

  async function handleRemove(symbol: string) {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/watchlist/${symbol}`, {
        method: "DELETE",
        credentials: "include",
      });

      setWatchlistRows((current) =>
        current.filter((row) => row.symbol !== symbol),
      );
    } catch (error) {
      console.error("Failed to remove from watchlist:", error);
    }
  }
  const [allMarketRows, setAllMarketRows] = useState<
    {
      symbol: string;
      name: string;
      price: number;
      changePct: number;
      volume: string;
    }[]
  >([]);

  useEffect(() => {
    if (!watchlistOnly) {
      loadMarkets();
    }
  }, [watchlistOnly]);

  async function loadMarkets() {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/markets/`, {
        credentials: "include",
      });
      const data = await res.json();
      setAllMarketRows(data);
    } catch (error) {
      console.error("Failed to load markets:", error);
    }
  }
  async function handleAddToWatchlist(symbol: string) {
  try {
    await fetch(`${import.meta.env.VITE_API_URL}/api/watchlist/${symbol}`, {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Failed to add to watchlist:", error);
  }
}
  const rows = useMemo(() => {
    const base = watchlistOnly ? watchlistRows : allMarketRows;
    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter(
      (r) =>
        r.symbol.toLowerCase().includes(q) || r.name.toLowerCase().includes(q),
    );
  }, [query, watchlistOnly, watchlistRows, allMarketRows]);
  return (
    <>
      <PageTitle
        eyebrow="TradeSphere"
        title={watchlistOnly ? "Watchlist" : "Markets"}
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
              {watchlistOnly ? "Your saved assets" : "Market overview"}
            </h2>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-muted">
            <LiveDot /> Market open
          </span>
        </div>
        <MarketTable
          rows={rows}
          actionLabel="Trade"
          onAction={(symbol) => navigate(`/trade/${symbol}`)}
          onSymbolClick={(symbol) => navigate(`/stock/${symbol}`)}
          onRemove={watchlistOnly ? handleRemove : undefined}
          onAddToWatchlist={!watchlistOnly ? handleAddToWatchlist : undefined}
        />
      </Card>
    </>
  );
}
