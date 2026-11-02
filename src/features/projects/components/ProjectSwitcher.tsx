import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Check, ChevronDown, FolderKanban, Search } from "lucide-react";
import { useProjects } from "../../../hooks/useProjects";
import { useTranslation } from "../../../store/useAppStore";

export function ProjectSwitcher() {
  const { t, isRtl } = useTranslation();
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { projects, isLoading } = useProjects();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const selectedProject = projects.find((project) => project.id === projectId);
  const filteredProjects = projects.filter((project) =>
    `${project.name} ${project.key}`.toLowerCase().includes(search.trim().toLowerCase()),
  );

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
      const target = event.target;
      const isTyping = target instanceof HTMLElement &&
        (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
      if (event.key === "/" && !isTyping && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        setIsOpen(true);
        window.requestAnimationFrame(() => searchRef.current?.focus());
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const chooseProject = (id: string) => {
    setIsOpen(false);
    setSearch("");
    navigate(`/projects/${id}`);
  };

  return (
    <div ref={rootRef} className="relative min-w-0">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-10 min-w-0 max-w-[min(20rem,42vw)] items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-2.5 text-start shadow-sm transition hover:border-indigo-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-700 dark:hover:bg-slate-800"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
          <FolderKanban size={15} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-xs font-bold text-slate-800 dark:text-slate-100">
            {selectedProject ? `${selectedProject.key} · ${selectedProject.name}` : isRtl ? "اختر مشروعاً" : "Choose a project"}
          </span>
          <span className="block truncate text-[10px] text-slate-500 dark:text-slate-400">{t.nav.projects}</span>
        </span>
        <ChevronDown size={15} className={`shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <div className={`absolute start-0 top-full z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] origin-top rounded-xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10 transition-all duration-150 dark:border-slate-700 dark:bg-slate-900 ${isOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0 pointer-events-none"}`}>
        <div className="relative mb-2">
          <Search size={14} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            ref={searchRef}
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={isRtl ? "ابحث عن مشروع" : "Search projects"}
            aria-label={isRtl ? "ابحث عن مشروع" : "Search projects"}
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 ps-9 pe-3 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>
        <div role="listbox" aria-label={isRtl ? "المشاريع" : "Projects"} className="max-h-64 space-y-0.5 overflow-y-auto">
          {isLoading ? (
            <p className="px-3 py-5 text-center text-xs text-slate-500">{t.projectsPage.loading}</p>
          ) : filteredProjects.length ? filteredProjects.map((project) => {
            const isSelected = project.id === projectId;
            return (
              <button
                key={project.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => chooseProject(project.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-start transition ${isSelected ? "bg-indigo-50 dark:bg-indigo-950/50" : "hover:bg-slate-50 dark:hover:bg-slate-800"}`}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-[10px] font-extrabold text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300">{project.key}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-semibold text-slate-800 dark:text-slate-100">{project.name}</span>
                  <span className="block truncate text-[10px] text-slate-500 dark:text-slate-400">{project.stats.totalTodos} {isRtl ? "مهمة" : "tasks"}</span>
                </span>
                {isSelected && <Check size={15} className="shrink-0 text-indigo-600 dark:text-indigo-400" />}
              </button>
            );
          }) : (
            <p className="px-3 py-5 text-center text-xs text-slate-500">{isRtl ? "لم يتم العثور على مشاريع" : "No projects found"}</p>
          )}
        </div>
      </div>
    </div>
  );
}
