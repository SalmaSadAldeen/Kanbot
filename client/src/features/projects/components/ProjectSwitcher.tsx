import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { Check, ChevronDown, FolderKanban, Search } from "lucide-react";
import { useProjects } from "../../../hooks/useProjects";
import { useTranslation, useAppStore } from "../../../store/useAppStore";

export function ProjectSwitcher() {
  const { isRtl } = useTranslation();
  const isCollapsed = useAppStore((state) => state.isCollapsed);
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { projects, isLoading, isError, error, refetch } = useProjects();
  const closeMobileSidebar = useAppStore((state) => state.closeMobileSidebar);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // مطابقة المشروع الحالي بدقة مع الـ useParams
  const selectedProject =
    projects.find((project) => project.id === projectId) || null;

  const filteredProjects = projects.filter((project) =>
    `${project.name} ${project.key}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const chooseProject = (id: string) => {
    setIsOpen(false);
    setSearch("");
    const pathSegments = location.pathname.split("/").filter(Boolean);
    // إذا كنا داخل مسار مشروع سابق، نقوم بتحديث الـ id، وإلا نوجه للباكلوع افتراضياً
    const currentSection = ["backlog", "board", "sprints"].includes(
      pathSegments[2] ?? "",
    )
      ? pathSegments[2]
      : "backlog";

    navigate(`/projects/${id}/${currentSection}`);
    closeMobileSidebar();
  };

  return (
    <div ref={rootRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        title={
          isCollapsed
            ? selectedProject?.name ||
              (isRtl ? "اختر مشروعاً" : "Choose a project")
            : undefined
        }
        className={`flex h-10 w-full items-center rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 ${
          isCollapsed ? "justify-center px-0" : "justify-between px-3 gap-2"
        }`}
      >
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
            <FolderKanban size={13} />
          </span>
          {!isCollapsed && (
            <span className="truncate text-xs font-bold text-slate-800 dark:text-slate-100">
              {selectedProject
                ? selectedProject.name
                : isRtl
                  ? "اختر مشروعاً"
                  : "Choose a project"}
            </span>
          )}
        </div>
        {!isCollapsed && (
          <ChevronDown
            size={14}
            className={`shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {isOpen && (
        <div className="absolute start-0 top-full z-50 mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
          <div className="relative mb-2">
            <Search
              size={14}
              className="absolute start-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              ref={searchRef}
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isRtl ? "بحث..." : "Search..."}
              className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 ps-8 pe-2 text-xs outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          <div className="max-h-48 overflow-y-auto space-y-1">
            {isLoading ? (
              <p className="p-3 text-center text-xs text-slate-400">
                {isRtl ? "جاري التحميل..." : "Loading..."}
              </p>
            ) : isError ? (
              <div
                className="p-2 text-center text-xs text-rose-600 dark:text-rose-400"
                role="alert"
              >
                {error instanceof Error
                  ? error.message
                  : isRtl
                    ? "تعذر تحميل المشاريع"
                    : "Unable to load projects"}
                <button
                  type="button"
                  onClick={() => void refetch()}
                  className="ms-2 underline"
                >
                  {isRtl ? "إعادة المحاولة" : "Retry"}
                </button>
              </div>
            ) : filteredProjects.length === 0 ? (
              <p className="p-3 text-center text-xs text-slate-500">
                {isRtl ? "لم يتم العثور على مشاريع" : "No projects found"}
              </p>
            ) : (
              filteredProjects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => chooseProject(project.id)}
                  className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-start text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <span className="truncate">{project.name}</span>
                  {project.id === selectedProject?.id && (
                    <Check
                      size={14}
                      className="text-indigo-600 dark:text-indigo-400"
                    />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
