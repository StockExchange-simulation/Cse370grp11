import { NavLink } from 'react-router-dom'
import { ArrowLeftRight, Banknote, CandlestickChart, HelpCircle, LayoutGrid, PieChart, ReceiptText, Settings, ShieldCheck, Star, User } from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/markets', label: 'Markets', icon: CandlestickChart },
  { to: '/portfolio', label: 'Portfolio', icon: PieChart },
  { to: '/orders', label: 'Orders', icon: ReceiptText },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/watchlist', label: 'Watchlist', icon: Star, count: 5 },
  { to: '/dividends', label: 'Dividends', icon: Banknote },
  { to: '/profile', label: 'Profile', icon: User },
]

type SidebarProps = { mobileOpen: boolean; onNavigate: () => void }

export function Sidebar({ mobileOpen, onNavigate }: SidebarProps) {
  return (
    <aside className={`fixed inset-y-0 left-0 z-20 flex w-[236px] shrink-0 flex-col overflow-y-auto overscroll-contain border-r border-line bg-surface px-3.5 pb-5 pt-[88px] transition-transform duration-200 lg:static lg:z-auto lg:h-full lg:translate-x-0 lg:pt-7 ${mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
      <nav className="flex flex-col gap-1">
        <p className="mb-2 px-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-muted/70">Workspace</p>
        {navItems.map((item) => <SideLink key={item.to} item={item} onNavigate={onNavigate} />)}
        <p className="mb-2 mt-7 px-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-muted/70">Administration</p>
        <SideLink item={{ to: '/admin', label: 'Admin overview', icon: ShieldCheck }} onNavigate={onNavigate} />
      </nav>
      <div className="mt-auto pt-6">
        <div className="my-4 flex items-center gap-2.5 rounded-lg bg-canvas p-3.5 text-accent">
          <HelpCircle size={18} className="shrink-0" />
          <div className="flex flex-col gap-0.5"><b className="text-xs">Need help?</b><small className="text-[10px] text-muted">Visit our support center</small></div>
        </div>
        <SideLink item={{ to: '/settings', label: 'Settings', icon: Settings }} onNavigate={onNavigate} />
        <p className="px-3.5 pt-3.5 text-[10px] leading-relaxed text-muted/70">© 2026 TradeSphere<br />Investing involves risk.</p>
      </div>
    </aside>
  )
}

function SideLink({ item, onNavigate }: { item: { to: string; label: string; icon: typeof LayoutGrid; end?: boolean; count?: number }; onNavigate: () => void }) {
  const Icon = item.icon
  return <NavLink to={item.to} end={item.end} onClick={onNavigate} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-[13px] transition ${isActive ? 'bg-accent-soft font-bold text-accent' : 'text-muted hover:bg-canvas hover:text-ink'}`}>
    <Icon size={18} />{item.label}{item.count ? <span className="ml-auto rounded-lg bg-accent-soft px-1.5 py-0.5 text-[10px] text-accent">{item.count}</span> : null}
  </NavLink>
}
