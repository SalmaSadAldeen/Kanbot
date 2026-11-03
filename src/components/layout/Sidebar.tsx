import { useState } from "react";
import { NavLink } from "react-router";
import {
  ListTodo,
  PlayCircle,
  Zap,
  FolderKanban,
  LogOut,
  AlertTriangle,
} from "lucide-react";
import { useTranslation, useAppStore } from "../../store/useAppStore";
import { ProjectSwitcher } from "../../features/projects/components/ProjectSwitcher";
import { useAuth } from "../../features/auth/AuthProvider";
import { Dialog } from "../ui/Dialog";
import { useParams } from "react-router";
export function Sidebar() {
  const { t } = useTranslation();
  const isCollapsed = useAppStore((state) => state.isCollapsed);
  const { user, logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // جلب الاسم والإيميل الحقيقيين من الـ Auth Context
  const userName = user?.name || "Salma Sad Aldeen";
  const userEmail = user?.email || "salma@mail.com";

  // توليد الحرفين الأولين مثل (SS) للاختصار
  const userInitials =
    userName
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "SS";

  const { projectId } = useParams<{ projectId: string }>();

  // الـ fallback في حال لم يكن هناك مشروع محدد، نوجهه للمشاريع أو نستخدم قيمة افتراضية
  const activeProjectId = projectId || "default";

  const projectNavigation = [
    {
      name: t.nav.backlog,
      href: `/projects/${activeProjectId}/backlog`,
      icon: ListTodo,
    },
    {
      name: t.nav.activeSprint,
      href: `/projects/${activeProjectId}/active-sprint`,
      icon: PlayCircle,
    },
    {
      name: t.nav.sprints,
      href: `/projects/${activeProjectId}/sprints`,
      icon: Zap,
    },
    { name: t.nav.projects, href: "/projects", icon: FolderKanban },
  ];
  return (
    <>
      <aside
        className={`relative flex h-full shrink-0 flex-col border-e border-slate-200 bg-slate-50/50 transition-[width] duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-900 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Project Switcher in Sidebar (مع مساحة مريحة لمنع طعج الأيقونة) */}
        <div className="p-3.5">
          <ProjectSwitcher />
        </div>

        <hr className="mx-3 border-slate-200 dark:border-slate-800" />

        {/* Main Navigation (بخطوط أكبر وأوضح) */}
        <nav aria-label="Main navigation" className="flex-1 space-y-1.5 p-3">
          {!isCollapsed && (
            <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {t.nav.projectSection}
            </p>
          )}

          {projectNavigation.map(({ name, href, icon: Icon }) => (
            <NavLink
              key={href}
              to={href}
              title={isCollapsed ? name : undefined}
              aria-label={isCollapsed ? name : undefined}
              className={({ isActive }) =>
                `group relative flex h-11 items-center rounded-xl text-sm font-semibold transition-colors duration-150 ${
                  isCollapsed ? "justify-center px-0" : "gap-3.5 px-3.5"
                } ${
                  isActive
                    ? "bg-slate-200/70 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                    : "text-slate-600 hover:bg-slate-200/40 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-100"
                }`
              }
            >
              <Icon
                size={19}
                className="shrink-0 text-slate-500 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-slate-100"
              />
              {!isCollapsed && <span className="truncate">{name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer: Dynamic User Profile */}
        <div className="mt-auto border-t border-slate-200 p-3.5 dark:border-slate-800">
          <div className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-slate-200/50 dark:hover:bg-slate-800">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              {userInitials}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-100">
                  {userName}
                </p>
                <p className="truncate text-[11px] text-slate-400">
                  {userEmail}
                </p>
              </div>
            )}
            {!isCollapsed && (
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(true)}
                className="text-slate-400 transition hover:text-rose-600 dark:hover:text-rose-400 focus-visible:outline-none"
                title={t.nav.logout}
                aria-label={t.nav.logout}
              >
                <LogOut size={17} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Logout Confirmation Dialog for Sidebar */}
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
