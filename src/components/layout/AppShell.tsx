import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Sidebar } from "../layout/Sidebar";
import { Topbar } from "../layout/Topbar";
import { ToastProvider } from "../ui/ToastProvider";
import { useAppStore } from "../../store/useAppStore";

export function AppShell() {
  const { isMobileSidebarOpen, closeMobileSidebar } = useAppStore();
  const location = useLocation();

  useEffect(() => { closeMobileSidebar(); }, [location.pathname, closeMobileSidebar]);

  // Close the mobile overlay sidebar on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileSidebarOpen) {
        // Only close if we're on a mobile viewport
        if (window.innerWidth < 1024) closeMobileSidebar();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isMobileSidebarOpen, closeMobileSidebar]);

  useEffect(() => {
    document.body.style.overflow = isMobileSidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileSidebarOpen]);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300">
      <ToastProvider />

      {/* ── Topbar — full width, always on top ── */}
      <Topbar />

      {/* ── Content row: sidebar + main ── */}
      <div className="relative flex flex-1 overflow-hidden">

        {/*
          Mobile backdrop overlay.
          Only rendered on small screens (<lg) when sidebar is open.
          Clicking it closes the sidebar.
        */}
        {isMobileSidebarOpen && (
          <div
            aria-hidden="true"
            onClick={closeMobileSidebar}
            className="fixed inset-0 top-16 z-20 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          />
        )}

        {/*
          Sidebar:
          • Desktop (lg+): participates in flex flow, pushes <main>.
            - isCollapsed → w-16 (icon-only)
            - !isCollapsed → w-64
          • Mobile (<lg): absolutely positioned, slides in/out over content.
            - isCollapsed → -translate-x-full (hidden off screen)
            - !isCollapsed → translate-x-0 (visible)
        */}
        <div
          className={[
            // Desktop: static flex child
            "lg:relative lg:z-auto lg:translate-x-0 lg:shrink-0",
            // Mobile: absolute overlay
            "absolute inset-y-0 start-0 z-30",
            // Smooth slide
            "transition-transform duration-300 ease-in-out",
            // Mobile visibility: hidden when isCollapsed, visible when open
            isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full lg:translate-x-0",
          ].join(" ")}
        >
          <Sidebar />
        </div>

        {/* ── Main content area ── */}
        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
