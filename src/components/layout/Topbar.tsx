import { useState } from "react";
import {
  Globe,
  Moon,
  Sun,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../../features/auth/AuthProvider";
import { useAppStore, useTranslation } from "../../store/useAppStore";
import { ProjectSwitcher } from "../../features/projects/components/ProjectSwitcher";
import { Dialog } from "../ui/Dialog"; // تأكدي من مسار الـ Dialog بحسب مشروعك

export function Topbar() {
  const { user, logout } = useAuth();
  const { t, isRtl } = useTranslation();
  const { theme, isCollapsed, toggleTheme, toggleLanguage, toggleSidebar } =
    useAppStore();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  return (
    <>
      <header className="flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 px-6 backdrop-blur-xl transition-colors dark:border-slate-800/80 dark:bg-slate-900/95 shrink-0 z-20">
        {/* القسم الأيسر/الأيمن: اللوغو وزر الطي بمكان ثابت تماماً فوق السايد بار */}
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={t.topbar.toggleSidebar}
            title={t.topbar.toggleSidebar}
            aria-pressed={isCollapsed}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            {isCollapsed ? (
              <PanelLeftOpen
                size={18}
                className={isRtl ? "scale-x-[-1]" : ""}
              />
            ) : (
              <PanelLeftClose
                size={18}
                className={isRtl ? "scale-x-[-1]" : ""}
              />
            )}
          </button>

          <div className="hidden shrink-0 items-center gap-2.5 sm:flex">
            <img
              src="/kanbot-icon.png"
              alt={t.topbar.kanbotLogoAlt}
              className="h-8 w-8 object-contain"
            />
            <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              {t.brand}
            </span>
          </div>
          <div className="h-6 w-px shrink-0 bg-slate-200 dark:bg-slate-700" />
          <ProjectSwitcher />
        </div>

        {/* قسم الأدوات (اللغة، الثيم، والمستخدم) */}
        <div className="flex items-center gap-3">
          {/* Language Switch Button */}
          <button
            type="button"
            onClick={toggleLanguage}
            title={isRtl ? t.topbar.switchLangToEn : t.topbar.switchLangToAr}
            aria-label={
              isRtl ? t.topbar.switchLangToEn : t.topbar.switchLangToAr
            }
            className="flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 text-xs font-bold text-slate-700 transition-all hover:border-indigo-300 hover:bg-slate-100 focus-visible:outline-none dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:border-indigo-600"
          >
            <Globe size={15} className="text-indigo-600 dark:text-indigo-500" />
            <span>{isRtl ? "English" : "العربية"}</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? t.theme.toLight : t.theme.toDark}
            title={theme === "dark" ? t.theme.toLight : t.theme.toDark}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50/80 text-slate-700 transition-all hover:border-amber-400 hover:bg-slate-100 focus-visible:outline-none dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:border-amber-400 dark:hover:bg-slate-700"
          >
            {theme === "dark" ? (
              <Sun
                size={17}
                className="text-amber-400 transition-transform rotate-0 hover:rotate-45"
              />
            ) : (
              <Moon
                size={17}
                className="text-slate-600 transition-transform hover:-rotate-12"
              />
            )}
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

          {/* User Profile Badge */}
          <div className="flex items-center gap-3 rounded-xl border border-transparent p-1 transition-colors hover:border-slate-200 dark:hover:border-slate-800">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white shadow-md shadow-indigo-600/20">
              {user?.name ? (
                user.name.charAt(0).toUpperCase()
              ) : (
                <User size={15} />
              )}
            </div>
            <span className="hidden text-xs font-bold text-slate-700 sm:inline-block dark:text-slate-200">
              {user?.name || t.user.guest}
            </span>
          </div>

          {/* Logout Button (Opens Confirmation Modal) */}
          <button
            type="button"
            onClick={() => setIsLogoutModalOpen(true)}
            title={t.auth.logout}
            aria-label={t.auth.logout}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 dark:text-slate-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
          >
            <LogOut size={17} />
          </button>
        </div>
      </header>

      {/* Logout Confirmation Dialog */}
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
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {t.auth.cancel}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogoutModalOpen(false);
                logout();
              }}
              className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-rose-600/20 transition hover:bg-rose-700 focus-visible:outline-none"
            >
              {t.auth.logout}
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
