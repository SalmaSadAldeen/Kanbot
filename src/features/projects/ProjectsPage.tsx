import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { Activity, FolderKanban, ListTodo, Plus } from "lucide-react";
import { useTranslation } from "../../store/useAppStore";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { Spinner } from "../../components/ui/Spinner";
import { Dialog } from "../../components/ui/Dialog";
import { useProjects } from "../../hooks/useProjects";
import type { ProjectWithStats } from "../../types/api";
import { ProjectFormDialog } from "./ProjectFormDialog";
import { ProjectCard } from "./components/ProjectCard";

export function ProjectsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { projects, isLoading, isError, error, refetch, deleteProject } = useProjects();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectWithStats | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<ProjectWithStats | null>(null);
  const [isDeletingActive, setIsDeletingActive] = useState(false);

  const openCreate = () => { setSelectedProject(null); setIsFormOpen(true); };
  const openEdit = (project: ProjectWithStats) => { setSelectedProject(project); setIsFormOpen(true); };
  const confirmDelete = async () => {
    if (!projectToDelete) return;
    setIsDeletingActive(true);
    setDeletingId(projectToDelete.id);
    try { await deleteProject(projectToDelete.id); setProjectToDelete(null); }
    finally { setIsDeletingActive(false); setDeletingId(null); }
  };
  const totalTodos = projects.reduce((sum, project) => sum + project.stats.totalTodos, 0);
  const activeSprints = projects.filter((project) => project.stats.activeSprint !== null).length;

  return (
    <main className="mx-auto w-full max-w-7xl space-y-7">
      <header className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-400">{t.projectsPage.workspace}</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">{t.projectsPage.title}</h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">{t.projectsPage.subtitle}</p>
        </div>
        <Button onClick={openCreate} leftIcon={<Plus size={17} />} className="self-start rounded-xl shadow-sm shadow-indigo-600/20 sm:self-auto">{t.projectsPage.newProject}</Button>
      </header>

      {!isLoading && !isError && projects.length > 0 && <section aria-label={t.projectsPage.title} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label={t.projectsPage.stats.projects} value={projects.length} icon={<FolderKanban size={19} />} />
        <StatCard label={t.projectsPage.stats.totalTodos} value={totalTodos} icon={<ListTodo size={19} />} />
        <StatCard label={t.projectsPage.stats.activeSprints} value={activeSprints} icon={<Activity size={19} />} />
      </section>}

      {isLoading ? <div className="flex min-h-72 flex-col items-center justify-center gap-2 text-sm text-slate-500" role="status"><Spinner size="lg" /><span>{t.projectsPage.loading}</span></div>
        : isError ? <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-7 text-center dark:border-rose-900/60 dark:bg-rose-950/20" role="alert"><p className="font-semibold text-slate-900 dark:text-slate-100">{t.projectsPage.errorTitle}</p><p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{error instanceof Error ? error.message : t.projectsPage.errorTitle}</p><Button variant="outline" className="mt-4" onClick={() => void refetch()}>{t.projectsPage.retry}</Button></div>
        : projects.length === 0 ? <EmptyState title={t.projectsPage.emptyTitle} description={t.projectsPage.emptyDesc} icon={<FolderKanban size={30} className="text-indigo-600 dark:text-indigo-400" />} action={<Button onClick={openCreate} leftIcon={<Plus size={17} />}>{t.projectsPage.emptyAction}</Button>} />
        : <section aria-label={t.projectsPage.title} className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">{projects.map((project) => <ProjectCard key={project.id} project={project} isDeleting={deletingId === project.id} onEdit={openEdit} onDelete={setProjectToDelete} />)}</section>}

      <ProjectFormDialog key={`${isFormOpen}-${selectedProject?.id ?? "new"}`} isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onCreated={(projectId) => navigate(`/projects/${projectId}/board`)} projectToEdit={selectedProject} />

      <Dialog isOpen={!!projectToDelete} onClose={() => !isDeletingActive && setProjectToDelete(null)} title={t.projectsPage.deleteConfirm.title}>
        <div className="space-y-5">
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900/60 dark:bg-rose-950/20"><p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{t.projectsPage.deleteConfirm.message.replace("{name}", projectToDelete?.name ?? "")}</p></div>
          <div className="flex justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-800"><Button variant="secondary" onClick={() => setProjectToDelete(null)} disabled={isDeletingActive}>{t.projectsPage.deleteConfirm.cancel}</Button><Button variant="danger" onClick={() => void confirmDelete()} disabled={isDeletingActive}>{isDeletingActive ? <Spinner size="sm" className="p-0" /> : t.projectsPage.deleteConfirm.confirm}</Button></div>
        </div>
      </Dialog>
    </main>
  );
}

interface StatCardProps { label: string; value: number; icon: ReactNode; }
function StatCard({ label, value, icon }: StatCardProps) {
  return <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">{icon}</span><div className="min-w-0"><p className="truncate text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</p><p className="mt-0.5 text-2xl font-extrabold leading-7 tabular-nums text-slate-900 dark:text-slate-100">{value}</p></div></div>;
}
