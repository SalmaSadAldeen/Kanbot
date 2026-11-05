import { useState } from "react";
import {
  Globe,
  Moon,
  Sun,
  User,
  PanelLeftClose,
  LogOut,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../../features/auth/AuthProvider";
import { useAppStore, useTranslation } from "../../store/useAppStore";
import { Dialog } from "../ui/Dialog";

export function Topbar() {
  const { user, logout } = useAuth();
  const { t, lang } = useTranslation();
  const { theme, isCollapsed, isMobileSidebarOpen, toggleTheme, toggleLanguage, toggleSidebar } =
    useAppStore();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const isRtl = lang === "ar";

  return (
    <>
      <header className="flex h-14 w-full shrink-0 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-900/95 z-20">
        
        {/* Left/Right: Sidebar Toggle + brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={t.topbar.toggleSidebar}
            title={t.topbar.toggleSidebar}
            aria-expanded={window.innerWidth < 1024 ? isMobileSidebarOpen : !isCollapsed}
            aria-controls="app-sidebar"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 cursor-pointer"
          >
            {/* استخدام أيقونة واحدة مع تطبيق الدوران 180 درجة وانعكاس الاتجاه حسب اللغة */}
            <span
              className={`inline-flex items-center justify-center transition-transform duration-300 ${
                isCollapsed
                  ? isRtl
                    ? "rotate-180 scale-x-[-1]"
                    : "rotate-180"
                  : isRtl
                  ? "scale-x-[-1]"
                  : ""
              }`}
            >
              <PanelLeftClose size={18} />
            </span>
          </button>

          <div className="flex items-center gap-2">
            <img
              src="/kanbot-icon.png"
              alt={t.topbar.kanbotLogoAlt}
              className="h-7 w-7 object-contain"
            />
            <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              {t.brand}
            </span>
          </div>
        </div>

        {/* Controls */}
        <nav aria-label="Top bar controls" className="flex items-center gap-1.5">
          {/* Language toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            title={t.topbar.switchLangToAr}
            aria-label={t.topbar.switchLangToAr}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs font-bold text-slate-700 transition hover:border-indigo-300 hover:bg-slate-100 focus-visible:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-indigo-600 dark:hover:bg-slate-700 cursor-pointer"
          >
            <Globe size={14} className="text-indigo-500 dark:text-indigo-400" />
            <span className="hidden sm:inline">AR / EN</span>
          </button>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? t.theme.toLight : t.theme.toDark}
            title={theme === "dark" ? t.theme.toLight : t.theme.toDark}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 transition hover:border-amber-400 hover:bg-slate-100 focus-visible:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-amber-400 dark:hover:bg-slate-700 cursor-pointer"
          >
            {theme === "dark" ? (
              <Sun size={16} className="text-amber-400" />
            ) : (
              <Moon size={16} className="text-slate-500" />
            )}
          </button>

          <div className="mx-1 h-4 w-px bg-slate-200 dark:bg-slate-700" />

          {/* User avatar */}
          <div className="flex items-center gap-2 rounded-lg px-1.5 py-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white shadow-sm">
              {user?.name ? (
                user.name.charAt(0).toUpperCase()
              ) : (
                <User size={13} />
              )}
            </div>
            <span className="hidden text-xs font-semibold text-slate-700 sm:block dark:text-slate-300">
              {user?.name ?? t.user.guest}
            </span>
          </div>

          {/* Logout (مع دوران الأيقونة أيضاً إذا رغبتِ بانعكاسها حسب الاتجاه) */}
          <button
            type="button"
            onClick={() => setIsLogoutModalOpen(true)}
            title={t.auth.logout}
            aria-label={t.auth.logout}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none dark:text-slate-500 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 cursor-pointer"
          >
            <span className={isRtl ? "scale-x-[-1]" : ""}>
              <LogOut size={16} />
            </span>
          </button>
        </nav>
      </header>

      <Dialog
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title={t.auth.logoutTitle}
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {t.auth.logoutMessage}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {t.auth.logoutDesc}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setIsLogoutModalOpen(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
            >
              {t.auth.cancel}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogoutModalOpen(false);
                logout();
              }}
              className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-rose-600/20 transition hover:bg-rose-700 focus-visible:outline-none cursor-pointer"
            >
              {t.auth.logout}
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
