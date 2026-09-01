import {
  ArrowRight,
  Check,
  ChevronRight,
  CircleDollarSign,
  LineChart,
  Menu,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const highlights = [
  {
    icon: LineChart,
    title: "See the whole market",
    text: "Real-time prices, clean charts, and the signal you need to act with confidence.",
  },
  {
    icon: CircleDollarSign,
    title: "Invest on your terms",
    text: "Build a portfolio around the companies and ideas you believe in.",
  },
  {
    icon: ShieldCheck,
    title: "Built with clarity",
    text: "Transparent pricing, secure infrastructure, and no confusing fine print.",
  },
];

const markets = [
  ["S&P 500", "5,321.41", "+0.84%"],
  ["NASDAQ", "16,742.39", "+1.12%"],
  ["Dow Jones", "39,872.99", "+0.31%"],
];

export function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="min-h-screen overflow-hidden bg-surface text-ink">
      <header className="relative z-20 mx-auto flex max-w-[1240px] items-center justify-between px-5 py-5 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2.5 text-[19px] font-extrabold tracking-[-0.04em]"
        >
          <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-accent text-sm text-white">
            T
          </span>
          Trade<span className="text-accent">Sphere</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
          <a href="#markets" className="transition hover:text-ink">
            Markets
          </a>
          <a href="#why" className="transition hover:text-ink">
            Why TradeSphere
          </a>
          <a href="#security" className="transition hover:text-ink">
            Security
          </a>
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/login"
            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-canvas"
          >
            Log in
          </Link>
          <Link
            to="/login"
            className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(73,103,216,.2)] transition hover:bg-accent-hover"
          >
            Open an account <ArrowRight className="ml-1 inline" size={15} />
          </Link>
        </div>
        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="grid place-items-center rounded-lg p-2 text-muted md:hidden"
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        {menuOpen && (
          <div className="absolute left-5 right-5 top-[72px] rounded-2xl border border-line bg-surface p-4 shadow-xl md:hidden">
            <div className="flex flex-col gap-1">
              <a
                href="#markets"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-sm"
              >
                Markets
              </a>
              <a
                href="#why"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-sm"
              >
                Why TradeSphere
              </a>
              <Link
                to="/login"
                className="mt-2 rounded-lg bg-accent px-3 py-3 text-center text-sm font-semibold text-white"
              >
                Log in to TradeSphere
              </Link>
            </div>
          </div>
        )}
      </header>

      <main>
        <section className="mx-auto grid max-w-[1240px] items-center gap-12 px-5 pb-20 pt-14 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:pb-28 lg:pt-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-soft px-3 py-1.5 text-xs font-semibold text-accent">
              <Sparkles size={13} /> Investing, made understandable
            </div>
            <h1 className="max-w-[660px] text-balance text-5xl font-extrabold leading-[1.02] tracking-[-0.065em] sm:text-6xl lg:text-[76px]">
              A clearer way to{" "}
              <span className="text-accent">move with the market.</span>
            </h1>
            <p className="mt-6 max-w-[550px] text-pretty text-base leading-7 text-muted sm:text-lg">
              Trade stocks, follow the ideas shaping tomorrow, and build a
              portfolio that feels like yours. All in one beautifully simple
              platform.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-lg bg-accent px-5 py-3.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(73,103,216,.23)] transition hover:bg-accent-hover"
              >
                Start investing <ArrowRight className="ml-2" size={17} />
              </Link>
              <a
                href="#markets"
                className="inline-flex items-center justify-center rounded-lg border border-line px-5 py-3.5 text-sm font-semibold text-ink transition hover:bg-canvas"
              >
                Explore markets
              </a>
            </div>
            <div className="mt-9 flex items-center gap-5 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <Check className="text-teal" size={14} /> No account minimums
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="text-teal" size={14} /> Commission-free trades
              </span>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[520px]">
            <div className="absolute -inset-8 rounded-full bg-accent/8 blur-3xl" />
            <div className="relative overflow-hidden rounded-[26px] border border-line bg-canvas p-4 shadow-[0_30px_70px_rgba(23,32,51,.12)] sm:p-5">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[.12em] text-muted">
                    Portfolio value
                  </p>
                  <p className="mt-1 text-3xl font-bold tracking-[-.04em]">
                    $48,294.62
                  </p>
                </div>
                <span className="rounded-full bg-teal/10 px-2.5 py-1 text-xs font-semibold text-teal">
                  +12.48%
                </span>
              </div>
              <div className="mt-5 rounded-xl border border-line bg-surface p-3">
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>Performance</span>
                  <span>
                    1Y <ChevronRight className="inline" size={13} />
                  </span>
                </div>
                <svg
                  viewBox="0 0 600 220"
                  className="mt-3 h-[190px] w-full"
                  role="img"
                  aria-label="Portfolio performance chart"
                >
                  <defs>
                    <linearGradient
                      id="landingFill"
                      x1="0"
                      x2="0"
                      y1="0"
                      y2="1"
                    >
                      <stop offset="0" stopColor="#4967d8" stopOpacity=".2" />
                      <stop offset="1" stopColor="#4967d8" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 183 C55 178 72 152 126 159 S190 124 238 138 S302 101 345 111 S398 82 440 92 S510 36 600 49 V220 H0 Z"
                    fill="url(#landingFill)"
                  />
                  <path
                    d="M0 183 C55 178 72 152 126 159 S190 124 238 138 S302 101 345 111 S398 82 440 92 S510 36 600 49"
                    fill="none"
                    stroke="#4967d8"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="flex justify-between text-[10px] text-muted">
                  <span>Jan</span>
                  <span>Apr</span>
                  <span>Jul</span>
                  <span>Oct</span>
                  <span>Now</span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-surface p-3">
                  <p className="text-[10px] text-muted">Today</p>
                  <p className="mt-1 text-sm font-bold text-teal">+$384.20</p>
                </div>
                <div className="rounded-xl bg-surface p-3">
                  <p className="text-[10px] text-muted">Invested</p>
                  <p className="mt-1 text-sm font-bold">$41,150</p>
                </div>
                <div className="rounded-xl bg-surface p-3">
                  <p className="text-[10px] text-muted">Cash</p>
                  <p className="mt-1 text-sm font-bold">$7,144</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="markets" className="border-y border-line bg-canvas">
          <div className="mx-auto flex max-w-[1240px] flex-col gap-5 px-5 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted">
              <span className="h-2 w-2 rounded-full bg-teal" /> Markets are open
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {markets.map(([name, value, change]) => (
                <div key={name} className="flex gap-3 text-sm">
                  <span className="text-muted">{name}</span>
                  <b>{value}</b>
                  <span className="font-semibold text-teal">{change}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="why"
          className="mx-auto max-w-[1240px] px-5 py-20 lg:px-8 lg:py-28"
        >
          <div className="max-w-[620px]">
            <p className="text-xs font-bold uppercase tracking-[.14em] text-accent">
              The TradeSphere difference
            </p>
            <h2 className="mt-3 text-4xl font-extrabold tracking-[-.055em] sm:text-5xl">
              Everything you need. Nothing in your way.
            </h2>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {highlights.map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="rounded-2xl border border-line bg-surface p-6 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent-soft text-accent">
                  <Icon size={21} />
                </div>
                <h3 className="mt-6 text-lg font-bold tracking-tight">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
                <a
                  href="#security"
                  className="mt-6 inline-flex items-center text-xs font-bold text-accent"
                >
                  Learn more <ArrowRight className="ml-1" size={14} />
                </a>
              </article>
            ))}
          </div>
        </section>

        <section id="security" className="bg-ink text-white">
          <div className="mx-auto flex max-w-[1240px] flex-col gap-8 px-5 py-16 sm:flex-row sm:items-center sm:justify-between lg:px-8 lg:py-20">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.14em] text-[#a9b9ff]">
                Your money, your decisions
              </p>
              <h2 className="mt-3 max-w-[650px] text-3xl font-extrabold tracking-[-.05em] sm:text-4xl">
                Start with a platform that puts clarity first.
              </h2>
            </div>
            <Link
              to="/login"
              className="inline-flex shrink-0 items-center justify-center rounded-lg bg-white px-5 py-3.5 text-sm font-bold text-ink transition hover:bg-[#e9edff]"
            >
              Create your account <ArrowRight className="ml-2" size={17} />
            </Link>
          </div>
        </section>
      </main>
      <footer className="mx-auto flex max-w-[1240px] flex-col gap-4 px-5 py-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <span className="font-bold text-ink">
          Trade<span className="text-accent">Sphere</span>
        </span>
        <span>© 2026 TradeSphere. Investing involves risk.</span>
        <span>Privacy · Terms · Support</span>
      </footer>
    </div>
  );
}
