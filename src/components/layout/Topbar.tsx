import { Globe, Moon, Sun, User } from "lucide-react";
import { useAuth } from "../../features/auth/AuthProvider";
import { useAppStore, useTranslation } from "../../store/useAppStore";

export function Topbar() {
  const { user } = useAuth();
  const { t, isRtl } = useTranslation();
  const { theme, toggleTheme, toggleLanguage } = useAppStore();

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 px-6 backdrop-blur-xl transition-colors dark:border-slate-800/80 dark:bg-slate-900/90">
      <div>
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight">
          {t.workspaceOverview}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        {/* Language Switch Button */}
        <button
          type="button"
          onClick={toggleLanguage}
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
      </div>
    </header>
  );
}
