import { useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function AccountMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
    } finally {
      setOpen(false);
      navigate("/login", { replace: true });
    }
  }
  return (
    <div className="relative shrink-0">
      <button
        type="button"
        aria-label={`Account menu for ${user?.first_name}`}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
        className="flex max-w-[180px] items-center gap-1.5 rounded-lg p-1 text-[13px] text-ink transition hover:bg-canvas sm:gap-2"
      >
        <span className="grid h-8.5 w-8.5 shrink-0 place-items-center rounded-full bg-accent-soft text-[11px] font-bold text-accent">
          {user?.first_name?.charAt(0)}
        </span>
        <span className="hidden truncate sm:inline">{user?.first_name}</span>
        <ChevronDown
          size={15}
          className={`shrink-0 text-muted transition ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-11 z-40 w-[min(208px,calc(100vw-20px))] rounded-xl border border-line bg-surface p-1.5 shadow-[0_14px_40px_rgba(28,38,51,0.14)]"
        >
          <div className="border-b border-line px-3 py-2.5">
            <p className="text-[13px] font-semibold text-ink">
              {user?.first_name}
            </p>
            <p className="mt-0.5 truncate text-[11px] text-muted">
              {user?.email}
            </p>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[13px] text-muted transition hover:bg-canvas hover:text-ink"
          >
            <LogOut size={16} /> Log out
          </button>
        </div>
      ) : null}
    </div>
  );
}
