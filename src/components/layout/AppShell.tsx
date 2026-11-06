import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Sidebar } from "../layout/Sidebar";
import { Topbar } from "../layout/Topbar";
import { ToastProvider } from "../ui/ToastProvider";
import { useAppStore } from "../../store/useAppStore";
import { AiRoot } from "../../features/ai/AiRoot";

export function AppShell() {
  const { isMobileSidebarOpen, closeMobileSidebar } = useAppStore();
  const location = useLocation();

  useEffect(() => {
    if (window.innerWidth < 1024) {
      closeMobileSidebar();
    }
  }, [location.pathname, closeMobileSidebar]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileSidebarOpen) {
        if (window.innerWidth < 1024) closeMobileSidebar();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isMobileSidebarOpen, closeMobileSidebar]);

  useEffect(() => {
    document.body.style.overflow =
      isMobileSidebarOpen && window.innerWidth < 1024 ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileSidebarOpen]);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-50">
      <ToastProvider />
      <AiRoot />

      <Topbar />

      <div className="flex flex-1 relative overflow-hidden">
        {isMobileSidebarOpen && (
          <div
            aria-hidden="true"
            onClick={closeMobileSidebar}
            className="fixed inset-0 top-16 z-20 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* الحاوية بترتب السايد بار والمين بشكل طبيعي ومستقر تماماً باللغتين */}
        <div className="shrink-0 z-30 lg:static flex">
          <Sidebar />
        </div>

        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
