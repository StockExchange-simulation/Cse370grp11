import { Link } from "react-router-dom";
import { Menu, Moon, Sun } from "lucide-react";
import { LiveDot } from "./ui";
import { AccountMenu } from "./AccountMenu";

type TopBarProps = {
  dark: boolean;
  onToggleTheme: () => void;
  onToggleSidebar: () => void;
};

export function TopBar({ dark, onToggleTheme, onToggleSidebar }: TopBarProps) {
  return (
    <header className="relative z-30 flex h-[72px] shrink-0 items-center gap-1.5 border-b border-line bg-surface px-2.5 sm:gap-7 sm:px-6">
      <button
        type="button"
        aria-label="Toggle navigation"
        onClick={onToggleSidebar}
        className="grid shrink-0 place-items-center p-1.5 text-muted lg:hidden"
      >
        <Menu size={21} />
      </button>
      <Link
        to="/"
        aria-label="TradeSphere home"
        className="flex min-w-0 shrink items-center gap-2 text-[18px] font-bold tracking-tight"
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] bg-accent text-[17px] font-extrabold text-white">
          T
        </span>
        <span className="truncate">
          <span className="hidden min-[360px]:inline">Trade</span>
          <span className="text-accent">Sphere</span>
        </span>
      </Link>
      <div className="ml-auto flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-5">
        <span className="hidden items-center gap-1.5 whitespace-nowrap text-xs text-muted lg:flex">
          <LiveDot /> Markets open
        </span>
        <button
          type="button"
          aria-label="Toggle dark mode"
          onClick={onToggleTheme}
          className="grid shrink-0 place-items-center p-1.5 text-muted transition hover:text-ink"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <AccountMenu />
      </div>
    </header>
  );
}
