import { Outlet } from "react-router";
import { Sidebar } from "../layout/Sidebar";
import { Topbar } from "../layout/Topbar";
import { ToastProvider } from "../ui/ToastProvider";

export function AppShell() {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300">
      <ToastProvider />

      {/* 1. التوب بار يمتد بعرض الشاشة بالكامل بالأعلى (وفيه الشعار وزر الطي) */}
      <Topbar />

      {/* 2. الحاوية السفلية تضم السايد بار والمحتوى جنباً إلى جنب */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-6 transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
}