import { NavLink } from "react-router";
import {
  CheckSquare,
  FolderKanban,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { useTranslation, useAppStore } from "../../store/useAppStore";

export function Sidebar() {
  const { t } = useTranslation();
  const isCollapsed = useAppStore((state) => state.isCollapsed);

  const navigation = [
    { name: t.nav.dashboard, href: "/dashboard", icon: LayoutDashboard },
    { name: t.nav.projects, href: "/projects", icon: FolderKanban },
    { name: t.nav.myTasks, href: "/tasks", icon: CheckSquare },
    { name: t.nav.settings, href: "/settings", icon: Settings },
  ];

  return (
    <aside
      className={`relative flex h-full shrink-0 flex-col border-s border-slate-200 bg-white transition-[width] duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-900 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* القائمة الرئيسية تبدأ فوراً من تحت التوب بار بسلاسة تامة */}
      <nav
        aria-label="Main navigation"
        className={`flex-1 space-y-1 py-6 ${isCollapsed ? "px-2" : "px-3"}`}
      >
        {navigation.map(({ name, href, icon: Icon }) => (
          <NavLink
            key={href}
            to={href}
            title={isCollapsed ? name : undefined}
            aria-label={isCollapsed ? name : undefined}
            className={({ isActive }) =>
              `group relative flex h-11 items-center rounded-xl text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                isCollapsed ? "justify-center px-0" : "gap-3 px-3"
              } ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-100"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`absolute inset-y-2 start-0 w-0.5 rounded-full bg-indigo-600 transition-opacity ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />
                <Icon size={19} className="shrink-0" />
                {!isCollapsed && <span className="truncate">{name}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {!isCollapsed && (
        <div className="border-t border-slate-200 px-4 py-3 text-center text-[11px] font-medium text-slate-400 dark:border-slate-800">
          {t.footer}
        </div>
      )}
    </aside>
  );
}
