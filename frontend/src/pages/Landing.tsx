import { useNavigate } from 'react-router-dom';
import './Landing.css';

interface TickerItem {
  symbol: string;
  price: string;
  change: string;
  up: boolean;
}

const TICKER: TickerItem[] = [
  { symbol: 'AAPL', price: '227.14', change: '+1.82%', up: true },
  { symbol: 'TSLA', price: '241.05', change: '-0.94%', up: false },
  { symbol: 'NVDA', price: '118.30', change: '+3.41%', up: true },
  { symbol: 'MSFT', price: '429.87', change: '+0.55%', up: true },
  { symbol: 'AMZN', price: '186.22', change: '-1.12%', up: false },
  { symbol: 'GOOGL', price: '171.09', change: '+0.28%', up: true },
  { symbol: 'META', price: '512.60', change: '-2.03%', up: false },
  { symbol: 'NFLX', price: '688.41', change: '+1.09%', up: true },
];

const FEATURES = [
  {
    label: 'Real prices',
    title: 'Live market data',
    body: 'Every quote tracks the real market. The only thing simulated is the money.',
  },
  {
    label: 'Zero risk',
    title: 'Start with virtual cash',
    body: 'Every account opens with a starting balance. Blow it all on one bad call and reset with no consequences.',
  },
  {
    label: 'Full history',
    title: 'Every trade, logged',
    body: 'Track your buys, sells, and portfolio value over time to see what actually worked.',
  },
];

function TickerTape() {
  // Render the strip twice back-to-back so the CSS scroll loop has no visible seam
  const items = [...TICKER, ...TICKER];
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track">
        {items.map((item, i) => (
          <span className="ticker__item" key={i}>
            <span className="ticker__symbol">{item.symbol}</span>
            <span className="ticker__price">{item.price}</span>
            <span className={item.up ? 'ticker__change ticker__change--up' : 'ticker__change ticker__change--down'}>
              {item.change}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <header className="landing__nav">
        <span className="landing__logo">
          Paper<span className="landing__logo-accent">Floor</span>
        </span>
        <button className="btn btn--ghost" onClick={() => navigate('/login')}>
          Log in
        </button>
      </header>

      <TickerTape />

      <main className="landing__hero">
        <p className="eyebrow">Practice trading, real market data</p>
        <h1 className="landing__headline">
          Trade like it's real.
          <br />
          Because the money isn't.
        </h1>
        <p className="landing__sub">
          Build a portfolio, place trades, and track your P&amp;L against live prices —
          without risking a single real dollar.
        </p>
        <div className="landing__cta-row">
          <button className="btn btn--primary" onClick={() => navigate('/login')}>
            Start trading
          </button>
          <button className="btn btn--ghost" onClick={() => navigate('/login')}>
            I have an account
          </button>
        </div>
      </main>

      <section className="landing__features">
        {FEATURES.map((f) => (
          <div className="feature-card" key={f.title}>
            <span className="feature-card__label">{f.label}</span>
            <h3 className="feature-card__title">{f.title}</h3>
            <p>{f.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
