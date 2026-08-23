import { ArrowRight, X, Star } from "lucide-react";
import { type MarketRow, usd, pct } from "../lib/data";
import { AssetMark } from "./ui";

export function MarketTable({
  rows,
  actionLabel = "Trade",
  onAction,
  onSymbolClick,
  onRemove,
  onAddToWatchlist,
}: {
  rows: MarketRow[];
  actionLabel?: string;
  onAction?: (symbol: string) => void;
  onSymbolClick?: (symbol: string) => void;
  onRemove?: (symbol: string) => void;
  onAddToWatchlist?: (symbol: string) => void;
}) {
  return (
    <div className="scrollbar-thin mt-4 overflow-x-auto">
      <table className="w-full min-w-[490px] border-collapse">
        <thead>
          <tr>
            {["Asset", "Price", "24h change", "Volume", ""].map((h, i) => (
              <th
                key={h || "action"}
                className={`pb-3 text-[9px] font-extrabold uppercase tracking-[0.08em] text-muted/80 ${
                  i === 0 ? "text-left" : i === 4 ? "text-right" : "text-left"
                } px-2.5 first:pl-0 last:pr-0`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.symbol}>
              <td className="border-t border-line/60 px-2.5 py-3 pl-0">
                <div className="flex items-center gap-2.5">
                  <AssetMark symbol={row.symbol} />
                  <span className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => onSymbolClick?.(row.symbol)}
                      className="w-fit text-left text-xs font-bold text-ink hover:text-accent hover:underline"
                    >
                      {row.symbol}
                    </button>
                    <small className="text-[10px] text-muted">{row.name}</small>
                  </span>
                </div>
              </td>
              <td className="border-t border-line/60 px-2.5 py-3 text-xs text-ink">
                {usd(row.price)}
              </td>
              <td
                className={`border-t border-line/60 px-2.5 py-3 text-xs font-semibold ${
                  row.changePct >= 0 ? "text-teal" : "text-danger"
                }`}
              >
                {pct(row.changePct)}
              </td>
              <td className="border-t border-line/60 px-2.5 py-3 text-xs text-muted">
                {row.volume}
              </td>
              <td className="border-t border-line/60 px-2.5 py-3 pr-0 text-right">
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => onAction?.(row.symbol)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline"
                  >
                    {actionLabel} <ArrowRight size={14} />
                  </button>
                  {onAddToWatchlist ? (
                    <button
                      type="button"
                      onClick={() => onAddToWatchlist(row.symbol)}
                      className="inline-flex items-center text-muted hover:text-accent"
                      aria-label={`Add ${row.symbol} to watchlist`}
                    >
                      <Star size={16} />
                    </button>
                  ) : null}
                  {onRemove ? (
                    <button
                      type="button"
                      onClick={() => onRemove(row.symbol)}
                      className="inline-flex items-center text-muted hover:text-danger"
                      aria-label={`Remove ${row.symbol} from watchlist`}
                    >
                      <X size={16} />
                    </button>
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
