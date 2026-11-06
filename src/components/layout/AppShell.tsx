import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Sidebar } from "../layout/Sidebar";
import { Topbar } from "../layout/Topbar";
import { ToastProvider } from "../ui/ToastProvider";
import { useAppStore, useTranslation } from "../../store/useAppStore";
import { AiRoot } from "../../features/ai/AiRoot";

export function AppShell() {
  const { isMobileSidebarOpen, closeMobileSidebar, isCollapsed } =
    useAppStore();
  const { isRtl } = useTranslation();
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

  // تحديد عرض السايد بار حسب حالة الطي (Collapsed أو مفتوح)
  const sidebarWidthClass = isCollapsed ? "lg:w-16" : "lg:w-64";
  const mainMarginClass = isRtl
    ? isCollapsed
      ? "lg:mr-16"
      : "lg:mr-64"
    : isCollapsed
      ? "lg:ml-16"
      : "lg:ml-64";

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="flex h-screen w-screen flex-col overflow-hidden bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-50"
    >
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

        {/* السايد بار بموضع ثابت مطلق على الديسكتوب لا يتأثر بأي تدفق ولن يتحرك أبداً */}
        <div
          className={`fixed lg:absolute top-0 bottom-0 ${isRtl ? "right-0" : "left-0"} z-30 h-full ${sidebarWidthClass} transition-none`}
        >
          <Sidebar />
        </div>

        {/* المحتوى الرئيسي يأخذ مساحة فارغة تكتيكية تناسب عرض السايد بار تماماً */}
        <main
          className={`flex-1 min-w-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6 ${mainMarginClass} transition-none`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
