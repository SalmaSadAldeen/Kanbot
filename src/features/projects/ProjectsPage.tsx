import { useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import {
  CircleDot,
  FolderKanban,
  ListTodo,
  Plus,
} from "lucide-react";
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

  // حالة نافذة تأكيد الحذف الخاصة بـ Dialog.tsx
  const [projectToDelete, setProjectToDelete] = useState<ProjectWithStats | null>(null);
  const [isDeletingActive, setIsDeletingActive] = useState(false);

  const openCreate = () => {
    setSelectedProject(null);
    setIsFormOpen(true);
  };

  const openEdit = (project: ProjectWithStats) => {
    setSelectedProject(project);
    setIsFormOpen(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    setIsDeletingActive(true);
    setDeletingId(projectToDelete.id);
    try {
      await deleteProject(projectToDelete.id);
      setProjectToDelete(null);
    } finally {
      setIsDeletingActive(false);
      setDeletingId(null);
    }
  };

  const totalTodos = projects.reduce((sum, project) => sum + project.stats.totalTodos, 0);
  const activeSprints = projects.filter((project) => project.stats.activeSprint !== null).length;

  return (
    <main className="mx-auto max-w-7xl space-y-7">
      <header className="flex flex-col gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800/80">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-400">Workspace</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">{t.nav.projects}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">نظّم مشاريعك وتابع المهام والسبرنتات من مكان واحد.</p>
        </div>
        <Button onClick={openCreate} leftIcon={<Plus size={18} />} className="self-start rounded-xl sm:self-auto">
          مشروع جديد
        </Button>
      </header>

      {!isLoading && !isError && projects.length > 0 && (
        <section aria-label="إحصائيات المشاريع" className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard label="المشاريع" value={projects.length} icon={<FolderKanban size={18} />} />
          <StatCard label="إجمالي المهام" value={totalTodos} icon={<ListTodo size={18} />} />
          <StatCard label="السبرنتات النشطة" value={activeSprints} icon={<CircleDot size={18} />} />
        </section>
      )}

      {isLoading ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-2 text-sm text-slate-500" role="status">
          <Spinner size="lg" />
          <span>جاري تحميل المشاريع...</span>
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/60 dark:bg-red-950/20" role="alert">
          <p className="font-semibold text-slate-900 dark:text-slate-100">تعذّر تحميل المشاريع</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{error instanceof Error ? error.message : "حدث خطأ غير متوقع."}</p>
          <Button variant="outline" className="mt-4" onClick={() => void refetch()}>إعادة المحاولة</Button>
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          title="لا توجد مشاريع حتى الآن"
          description="أنشئ مشروعك الأول لتنظيم المهام ومتابعة تقدم فريقك."
          icon={<FolderKanban size={32} className="text-indigo-600 dark:text-indigo-400" />}
          action={<Button onClick={openCreate} leftIcon={<Plus size={17} />}>إنشاء المشروع الأول</Button>}
        />
      ) : (
        <section aria-label="قائمة المشاريع" className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              isDeleting={deletingId === project.id}
              onEdit={openEdit}
              onDelete={(proj) => setProjectToDelete(proj)}
            />
          ))}
        </section>
      )}

      <ProjectFormDialog
        key={`${isFormOpen}-${selectedProject?.id ?? "new"}`}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onCreated={(projectId) => navigate(`/projects/${projectId}/board`)}
        projectToEdit={selectedProject}
      />

      {/* نافذة تأكيد الحذف المصممة بمكون الـ Dialog */}
      <Dialog
        isOpen={!!projectToDelete}
        onClose={() => !isDeletingActive && setProjectToDelete(null)}
        title="تأكيد حذف المشروع"
      >
        <div className="space-y-4 pt-2">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            هل أنت متأكد من حذف المشروع <strong className="text-slate-900 dark:text-slate-100">"{projectToDelete?.name}"</strong>؟ سيؤدي ذلك إلى حذف جميع مهامه وسبرنتاته نهائياً.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button
              variant="secondary"
              onClick={() => setProjectToDelete(null)}
              disabled={isDeletingActive}
            >
              إلغاء
            </Button>
            <Button
              variant="danger"
              onClick={() => void confirmDelete()}
              disabled={isDeletingActive}
            >
              {isDeletingActive ? <Spinner size="sm" className="p-0" /> : "حذف نهائي"}
            </Button>
          </div>
        </div>
      </Dialog>
    </main>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  icon: ReactNode;
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">{icon}</span>
      <div>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-lg font-bold leading-6 text-slate-900 dark:text-slate-100">{value}</p>
      </div>
    </div>
  );
}