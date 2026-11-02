import { NavLink } from "react-router";
import {
  CheckSquare,
  FolderKanban,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { useTranslation } from "../../store/useAppStore";

export function Sidebar() {
  const { t } = useTranslation();

  const navigation = [
    { name: t.nav.dashboard, href: "/dashboard", icon: LayoutDashboard },
    { name: t.nav.projects, href: "/projects", icon: FolderKanban },
    { name: t.nav.myTasks, href: "/tasks", icon: CheckSquare },
    { name: t.nav.settings, href: "/settings", icon: Settings },
  ];

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200/85 bg-white/80 backdrop-blur-xl transition-colors duration-300 dark:border-slate-800/85 dark:bg-slate-900/90">
      {/* Header / Brand - عرض صورتكِ كما هي تماماً بدون أي تعديل أو فلتر */}
      <div className="flex h-16 items-center gap-3.5 border-b border-slate-200/85 px-4 dark:border-slate-800/85">
        <div className="flex h-9 w-10 items-center justify-center">
          <img
            src="/kanbot-icon.png"
            alt="Kanbot Logo"
            className="h-8 w-8 object-contain"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-extrabold tracking-wide text-slate-900 dark:text-slate-100">
            Kanbot
          </span>
          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
            Workspace
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 px-3 py-5">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `group relative flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25 dark:bg-indigo-600 dark:shadow-indigo-950/50"
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100"
                }`
              }
            >
              <Icon
                size={19}
                className="transition-transform group-hover:scale-110"
              />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200/85 p-4 text-center text-[11px] font-medium text-slate-400 dark:border-slate-800/85">
        {t.footer}
      </div>
    </aside>
  );
}