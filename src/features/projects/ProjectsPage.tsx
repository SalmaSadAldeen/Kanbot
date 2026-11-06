import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { FolderKanban, Plus, Search } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "../../store/useAppStore";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { Spinner } from "../../components/ui/Spinner";
import { Dialog } from "../../components/ui/Dialog";
import { useProjects } from "../../hooks/useProjects";
import type { ProjectWithStats } from "../../types/api";
import { ProjectFormDialog } from "./ProjectFormDialog";
import { ProjectCard } from "./components/ProjectCard";
import { SearchEmptyState } from "./components/SearchEmptyState";

export function ProjectsPage() {
  const { t, isRtl } = useTranslation();
  const navigate = useNavigate();
  const { projects, isLoading, isError, error, refetch, deleteProject } =
    useProjects();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] =
    useState<ProjectWithStats | null>(null);

  // حالات الحذف
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [projectToDelete, setProjectToDelete] =
    useState<ProjectWithStats | null>(null);
  const [isDeletingActive, setIsDeletingActive] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  // إعداد الـ Debounce للبحث (300ms)
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const filteredProjects = projects.filter((p) =>
    `${p.name} ${p.key} ${p.description ?? ""}`
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase()),
  );

  const openCreate = () => {
    setSelectedProject(null);
    setIsFormOpen(true);
  };
  const openEdit = (project: ProjectWithStats) => {
    setSelectedProject(project);
    setIsFormOpen(true);
  };

  // 1. عند الضغط على حذف: الكارد تظل مكانها ويتغير بوردر الكارد نفسها للبرتقالي مع ظهور زر التراجع بداخلها
  const handleDeleteClick = (project: ProjectWithStats) => {
    setDeletingId(project.id);
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setDeletingId(null);
      setProjectToDelete(project); // بعد انتهاء المهلة يفتح ديالوغ التأكيد
    }, 4000);
  };

  // 2. التراجع عن الحذف
  const handleUndoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }
    setDeletingId(null);
  };

  // 3. التأكيد النهائي من الديالوغ وحذف المشروع مع إظهار توست النجاح مرة واحدة فقط
  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    setIsDeletingActive(true);
    try {
      await deleteProject(projectToDelete.id);

      setProjectToDelete(null);
    } finally {
      setIsDeletingActive(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Top Header */}
      <header className="flex items-center justify-between border-b border-slate-200 pb-5 dark:border-slate-800">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {t.projectsPage.title}
          </h1>
          <span className="text-sm font-medium text-slate-500">
            {projects.length} {t.projectsPage.stats.projects.toLowerCase()}
          </span>
        </div>
        <Button
          onClick={openCreate}
          leftIcon={<Plus size={16} />}
          className="rounded-xl shadow-sm shadow-indigo-600/25"
        >
          {t.projectsPage.newProject}
        </Button>
      </header>

      {/* Global Projects Search Input (Debounced) */}
      <div className="max-w-md">
        <div className="relative">
          <Search
            size={15}
            className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRtl ? "ابحث عن مشروع..." : "Search projects..."}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white ps-9 pe-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Content Section */}
      {isLoading ? (
        <div className="flex min-h-64 items-center justify-center gap-2 text-slate-500">
          <Spinner size="lg" />
          <span>{t.projectsPage.loading}</span>
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center dark:border-rose-900/60 dark:bg-rose-950/20">
          <p className="font-semibold text-slate-900 dark:text-slate-100">
            {error instanceof Error ? error.message : t.projectsPage.errorTitle}
          </p>
          <Button
            variant="outline"
            className="mt-3"
            onClick={() => void refetch()}
          >
            {t.projectsPage.retry}
          </Button>
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          title={t.projectsPage.emptyTitle}
          description={t.projectsPage.emptyDesc}
          icon={
            <FolderKanban
              size={36}
              className="text-slate-400 dark:text-slate-500"
            />
          }
          action={
            <Button
              onClick={openCreate}
              leftIcon={<Plus size={16} />}
              className="mt-2 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
            >
              {t.projectsPage.emptyAction}
            </Button>
          }
        />
      ) : filteredProjects.length === 0 ? (
        <SearchEmptyState onClear={() => setSearchQuery("")} />
      ) : (
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => {
            const isPending = deletingId === project.id;
            return (
              <ProjectCard
                key={project.id}
                project={project}
                isDeleting={isPending}
                onEdit={openEdit}
                onDelete={() => handleDeleteClick(project)}
                onUndo={handleUndoClick}
              />
            );
          })}

          {/* New Project Dashed Card */}
          <button
            type="button"
            onClick={openCreate}
            className="flex min-h-48 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-6 text-slate-600 transition hover:border-slate-400 hover:bg-slate-100/50 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400 dark:hover:border-slate-700"
          >
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
              + {t.projectsPage.newProject}
            </span>
          </button>
        </section>
      )}

      <ProjectFormDialog
        key={`${isFormOpen}-${selectedProject?.id ?? "new"}`}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onCreated={(id) => navigate(`/projects/${id}/backlog`)}
        projectToEdit={selectedProject}
      />

      {/* ديولوج التأكيد النهائي للحذف */}
      <Dialog
        isOpen={!!projectToDelete}
        onClose={() => !isDeletingActive && setProjectToDelete(null)}
        title={t.projectsPage.deleteConfirm.title}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {t.projectsPage.deleteConfirm.message.replace(
              "{name}",
              projectToDelete?.name ?? "",
            )}
          </p>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button
              variant="secondary"
              onClick={() => setProjectToDelete(null)}
              disabled={isDeletingActive}
            >
              {t.projectsPage.deleteConfirm.cancel}
            </Button>
            <Button
              variant="danger"
              onClick={() => void handleConfirmDelete()}
              disabled={isDeletingActive}
            >
              {isDeletingActive ? (
                <Spinner size="sm" />
              ) : (
                t.projectsPage.deleteConfirm.confirm
              )}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
