import type { ReactNode } from "react";

/* Small, reusable presentational primitives shared across every page. */

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-xl border border-line bg-surface p-5 sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.11em] text-accent">
      {children}
    </p>
  );
}

export function SectionHead({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-1 flex items-start justify-between gap-3">
      <div>
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h2 className="text-[17px] font-semibold tracking-tight text-ink">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

export function AssetMark({
  symbol,
  large = false,
}: {
  symbol: string;
  large?: boolean;
}) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-lg bg-[#263b85] font-extrabold text-white ${
        large ? "h-10 w-10 text-[13px]" : "h-7 w-7 text-[10px]"
      }`}
    >
      {symbol.slice(0, 1)}
    </span>
  );
}

const statusStyles: Record<string, string> = {
  filled: "bg-teal/10 text-teal",
  completed: "bg-teal/10 text-teal",
  paid: "bg-teal/10 text-teal",
  pending: "bg-amber-400/15 text-amber-600 dark:text-amber-400",
  upcoming: "bg-amber-400/15 text-amber-600 dark:text-amber-400",
  cancelled: "bg-danger/10 text-danger",
};

export function StatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase();
  return (
    <span
      className={`inline-block rounded-md px-2 py-1 text-[10px] font-bold ${
        statusStyles[key] ?? "bg-line text-muted"
      }`}
    >
      {status}
    </span>
  );
}

export function LiveDot() {
  return (
    <span className="inline-block h-[7px] w-[7px] rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.18)]" />
  );
}

export function PrimaryButton({
  children,
  onClick,
  className = "",
  tone = "accent",
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  tone?: "accent" | "danger";
  type?: "button" | "submit";
}) {
  const bg =
    tone === "danger"
      ? "bg-danger border-danger hover:brightness-95"
      : "bg-accent border-accent hover:bg-accent-hover";
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-bold text-white transition ${bg} ${className}`}
    >
      {children}
    </button>
  );
}

export function OutlineButton({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border border-accent/40 bg-surface px-4 py-2.5 text-xs font-bold text-accent transition hover:bg-accent-soft ${className}`}
    >
      {children}
    </button>
  );
}

export function PageTitle({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="text-[clamp(25px,3vw,32px)] font-bold leading-tight tracking-tight text-ink">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2 text-sm text-muted">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
