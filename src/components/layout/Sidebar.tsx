import { useMemo } from "react";
import { NavLink, useParams } from "react-router";
import {
  ListTodo,
  PlayCircle,
  Zap,
  FolderKanban,
} from "lucide-react";
import { useTranslation, useAppStore } from "../../store/useAppStore";
import { ProjectSwitcher } from "../../features/projects/components/ProjectSwitcher";
import { useAuth } from "../../features/auth/AuthProvider";

export function Sidebar() {
  const { t } = useTranslation();
  const isCollapsed = useAppStore((state) => state.isCollapsed);
  const { user } = useAuth();

  const userName = user?.name ?? "User";
  const userEmail = user?.email ?? "";

  const userInitials =
    userName
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  const { projectId } = useParams<{ projectId: string }>();

  // التحقق من أن معرف المشروع حقيقي وليس فارغاً أو كلمة وهمية
  const isValidProject = projectId && projectId !== "select";

  // تعريف الروابط باستخدام useMemo ومنع تكرار المسارات أو المفاتيح
  const projectNavigation = useMemo(() => {
    return [
      {
        id: "nav-backlog",
        name: t.nav.backlog,
        href: isValidProject ? `/projects/${projectId}/backlog` : "/projects",
        icon: ListTodo,
        exact: true,
      },
      {
        id: "nav-board",
        name: t.nav.activeSprint,
        href: isValidProject ? `/projects/${projectId}/board` : "/projects",
        icon: PlayCircle,
        exact: true,
      },
      {
        id: "nav-sprints",
        name: t.nav.sprints,
        href: isValidProject ? `/projects/${projectId}/sprints` : "/projects",
        icon: Zap,
        exact: true,
      },
      {
        id: "nav-projects",
        name: t.nav.projects,
        href: "/projects",
        icon: FolderKanban,
        exact: true,
      },
    ];
  }, [isValidProject, projectId, t]);

  return (
    <aside
      className={`flex h-full flex-col border-e border-slate-200 bg-slate-50/80 transition-[width] duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-900/95 ${
        isCollapsed ? "lg:w-16 w-64" : "w-64"
      }`}
    >
      <div
        className={`p-3 ${isCollapsed ? "pointer-events-none opacity-60" : ""}`}
      >
        <ProjectSwitcher />
      </div>

      <div className="mx-3 h-px bg-slate-200 dark:bg-slate-800" />

      <nav aria-label="Main navigation" className="flex-1 space-y-0.5 p-2.5">
        {!isCollapsed && (
          <p className="px-3 pb-1.5 pt-1 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            {t.nav.projectSection}
          </p>
        )}

        {projectNavigation.map(({ id, name, href, icon: Icon, exact }) => (
          <NavLink
            key={id}
            to={href}
            end={exact}
            title={isCollapsed ? name : undefined}
            aria-label={isCollapsed ? name : undefined}
            className={({ isActive }) =>
              [
                "group relative flex h-10 items-center rounded-xl text-sm font-semibold transition-colors duration-150",
                isCollapsed ? "justify-center px-0 lg:px-0" : "gap-3 px-3",
                isActive
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                  : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-100",
              ].join(" ")
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={18}
                  className={`shrink-0 transition-colors ${
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-slate-400 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-300"
                  }`}
                />
                {!isCollapsed && <span className="truncate">{name}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer: User profile info static display only */}
      <div className="border-t border-slate-200 p-2.5 dark:border-slate-800">
        <div
          className={`flex items-center rounded-xl p-2 ${
            isCollapsed ? "justify-center" : "gap-2.5"
          }`}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300">
            {userInitials}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-100">
                {userName}
              </p>
              <p className="truncate text-[11px] text-slate-400 dark:text-slate-500">
                {userEmail}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}