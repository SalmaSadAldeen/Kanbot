import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Check, ChevronDown, FolderKanban, Search } from "lucide-react";
import { useProjects } from "../../../hooks/useProjects";
import { useTranslation, useAppStore } from "../../../store/useAppStore"; // أضفنا useAppStore لمعرفة حالة الطي

export function ProjectSwitcher() {
  const { isRtl } = useTranslation();
  const isCollapsed = useAppStore((state) => state.isCollapsed); // جلب حالة طي السايد بار
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { projects, isLoading } = useProjects();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selectedProject =
    projects.find((project) => project.id === projectId) || projects[0];
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
    navigate(`/projects/${id}`);
  };

  return (
    <div ref={rootRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        title={isCollapsed ? (selectedProject?.name || "Project") : undefined}
        className={`flex h-10 w-full items-center rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 ${
          isCollapsed ? "justify-center px-0" : "justify-between px-3 gap-2"
        }`}
      >
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
            <FolderKanban size={13} />
          </span>
          {/* يختفي الاسم تماماً عندما يكون السايد بار مطوياً لكي لا يحدث أي تداخل أو طعج */}
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
        {/* يختفي السهم أيضاً عندما يكون السايد بار مطوياً */}
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
                Loading...
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