import { useMemo } from "react";
import { NavLink, useParams, useNavigate, useLocation } from "react-router";
import { ListTodo, PlayCircle, Zap, FolderKanban } from "lucide-react";
import { useTranslation, useAppStore } from "../../store/useAppStore";
import { ProjectSwitcher } from "../../features/projects/components/ProjectSwitcher";
import { useAuth } from "../../features/auth/AuthProvider";
import toast from "react-hot-toast";

export function Sidebar() {
  const { t, isRtl, lang } = useTranslation();
  const isCollapsed = useAppStore((state) => state.isCollapsed);
  const closeMobileSidebar = useAppStore((state) => state.closeMobileSidebar);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  const isValidProject = Boolean(
    projectId && projectId !== "select" && projectId !== "projects",
  );

  const currentPath = location.pathname;

  const projectNavigation = useMemo(() => {
    return [
      {
        id: "nav-backlog",
        name: t?.nav?.backlog ?? "Backlog",
        href: isValidProject ? `/projects/${projectId}/backlog` : "/projects",
        icon: ListTodo,
        exact: true,
        requiresProject: true,
        isCustomActive: currentPath.includes("/backlog"),
      },
      {
        id: "nav-board",
        name: t?.nav?.activeSprint ?? "Active Sprint",
        href: isValidProject ? `/projects/${projectId}/board` : "/projects",
        icon: PlayCircle,
        exact: true,
        requiresProject: true,
        isCustomActive: currentPath.includes("/board"),
      },
      {
        id: "nav-sprints",
        name: t?.nav?.sprints ?? "Sprints",
        href: isValidProject ? `/projects/${projectId}/sprints` : "/projects",
        icon: Zap,
        exact: true,
        requiresProject: true,
        isCustomActive: currentPath.includes("/sprints"),
      },
      {
        id: "nav-projects",
        name: t?.nav?.projects ?? "Projects",
        href: "/projects",
        icon: FolderKanban,
        exact: true,
        requiresProject: false,
        isCustomActive:
          currentPath === "/projects" || currentPath === "/" || !isValidProject,
      },
    ];
  }, [isValidProject, projectId, t, currentPath]);

  const handleNavClick = (e: React.MouseEvent, requiresProject: boolean) => {
    if (requiresProject && !isValidProject) {
      e.preventDefault();

      const alertMessage =
        t?.sidebar?.selectProjectFirst ??
        (lang === "ar" || isRtl
          ? "يرجى اختيار مشروع أولاً للوصول إلى هذه الصفحة"
          : "Please select a project first to access this page");

      toast.error(alertMessage, {
        duration: 4000,
        position: "top-center",
        id: "select-project-warning",
      });

      navigate("/projects");
      return;
    }

    closeMobileSidebar();
  };

  return (
    <aside
      key={lang}
      id="app-sidebar"
      dir={isRtl ? "rtl" : "ltr"}
      className={`flex flex-col h-full shrink-0 bg-slate-50/95 backdrop-blur-md dark:bg-slate-900/95 z-30 shadow-sm transition-all duration-300 ease-in-out overflow-hidden ${
        isRtl ? "border-l" : "border-r"
      } border-slate-200 dark:border-slate-800 ${
        isCollapsed ? "w-16 min-w-[4rem]" : "w-64 min-w-[16rem]"
      }`}
      style={{ flexShrink: 0 }}
    >
      <div
        className={`p-3 shrink-0 ${
          isCollapsed ? "pointer-events-none opacity-50" : "opacity-100"
        }`}
      >
        <ProjectSwitcher />
      </div>

      <div className="mx-3 h-px shrink-0 bg-slate-200 dark:bg-slate-800" />

      <nav
        aria-label="Main navigation"
        className="flex-1 space-y-1 p-2.5 overflow-y-auto overflow-x-hidden"
      >
        {!isCollapsed && (
          <p className="px-3 pb-2 pt-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            {t?.nav?.projectSection ?? "PROJECT"}
          </p>
        )}
        {projectNavigation.map(
          ({
            id,
            name,
            href,
            icon: Icon,
            exact,
            requiresProject,
            isCustomActive,
          }) => (
            <NavLink
              key={id}
              to={href}
              end={exact}
              onClick={(e) => handleNavClick(e, requiresProject)}
              title={isCollapsed ? name : undefined}
              aria-label={isCollapsed ? name : undefined}
              className={() => {
                const activeState = isCustomActive;
                return [
                  "group relative flex min-h-10 items-center rounded-xl text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                  isCollapsed ? "justify-center px-0" : "gap-3 px-3",
                  activeState
                    ? "bg-indigo-50/80 text-indigo-700 font-semibold shadow-xs before:absolute before:inset-y-2.5 rtl:before:right-0 ltr:before:left-0 before:w-1 before:rounded-e before:bg-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-300 dark:before:bg-indigo-400"
                    : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100",
                ].join(" ");
              }}
            >
              {() => {
                const activeState = isCustomActive;
                return (
                  <>
                    <Icon
                      size={18}
                      className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                        activeState
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-slate-400 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-300"
                      }`}
                    />
                    {!isCollapsed && (
                      <span className="truncate tracking-wide">{name}</span>
                    )}
                  </>
                );
              }}
            </NavLink>
          ),
        )}
      </nav>

      <div className="border-t border-slate-200/80 p-2.5 shrink-0 dark:border-slate-800/80 mt-auto bg-slate-100/50 dark:bg-slate-900/50">
        <div
          className={`flex items-center rounded-xl p-2 ${
            isCollapsed ? "justify-center" : "gap-2.5"
          }`}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-xs font-bold text-white shadow-xs">
            {userInitials}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-100">
                {userName}
              </p>
              <p className="truncate text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                {userEmail}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
