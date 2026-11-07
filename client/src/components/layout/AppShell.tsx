import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Sidebar } from "../layout/Sidebar";
import { Topbar } from "../layout/Topbar";
import { ToastProvider } from "../ui/ToastProvider";
import { useAppStore, useTranslation } from "../../store/useAppStore";
import { AiRoot } from "../../features/ai/AiRoot";

export function AppShell() {
  const { closeMobileSidebar, isCollapsed } = useAppStore();
  const { isRtl } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    if (window.innerWidth < 1024) {
      closeMobileSidebar();
    }
  }, [location.pathname, closeMobileSidebar]);

  // تحديد عرض السايدبار بناءً على حالة الطي (مفتوحة 256px أو مسكرة 64px)
  const sidebarWidth = isCollapsed ? "64px" : "256px";

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="flex h-screen w-screen flex-col overflow-hidden bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-50"
    >
      <ToastProvider />
      <AiRoot />

      {/* التوب بار في الأعلى */}
      <Topbar />

      {/* حاوية موحدة وثابتة للسايدبار والمحتوى */}
      <div className="flex flex-1 relative overflow-hidden w-full">
        {/* السايدبار يفتح ويغلق بسلاسة بناءً على زر الطي */}
        <div
          className="z-30 h-full flex-shrink-0"
          style={{
            width: sidebarWidth,
            minWidth: sidebarWidth,
            maxWidth: sidebarWidth,
            transition: "none",
          }}
        >
          <Sidebar isCollapsed={isCollapsed} />
        </div>

        {/* المحتوى الرئيسي */}
        <main
          className="flex-1 min-w-0 h-full overflow-y-auto overflow-x-hidden p-4 sm:p-6"
          style={{ transition: "none" }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
