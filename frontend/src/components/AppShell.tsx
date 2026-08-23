import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { useDarkMode } from "./useDarkMode";

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { dark, toggle } = useDarkMode();
  const closeSidebar = () => setMobileOpen(false);

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-canvas text-ink">
      <TopBar
        dark={dark}
        onToggleTheme={toggle}
        onToggleSidebar={() => setMobileOpen((value) => !value)}
      />
      <div className="relative mx-auto flex min-h-0 w-full max-w-[1520px] flex-1 overflow-hidden">
        {mobileOpen ? (
          <button
            type="button"
            aria-label="Close navigation"
            onClick={closeSidebar}
            className="fixed inset-0 top-[72px] z-10 bg-black/30 lg:hidden"
          />
        ) : null}
        <Sidebar mobileOpen={mobileOpen} onNavigate={closeSidebar} />
        <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-4 pb-16 pt-8 sm:px-6 lg:px-[clamp(20px,4vw,58px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
