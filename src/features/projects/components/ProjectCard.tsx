import { useNavigate } from "react-router";
import { CheckCircle2, Pencil, Trash2, ArrowRight } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Spinner } from "../../../components/ui/Spinner";
import { useTranslation } from "../../../store/useAppStore";
import type { ProjectWithStats } from "../../../types/api";

interface ProjectCardProps {
  project: ProjectWithStats;
  isDeleting: boolean;
  onEdit: (project: ProjectWithStats) => void;
  onDelete: (project: ProjectWithStats) => void;
}

export function ProjectCard({
  project,
  isDeleting,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <article className="group flex min-h-56 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-xs font-black tracking-wide text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
              {project.key}
            </div>
            <div className="min-w-0">
              <h2 className="truncate font-bold text-slate-900 dark:text-slate-100">
                {project.name}
              </h2>
              {project.stats.activeSprint ? (
                <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={13} />
                  <span>{project.stats.activeSprint.name}</span>
                </p>
              ) : (
                <p className="mt-0.5 text-xs text-slate-400">
                  {t.projectsPage.card.noActiveSprint}
                </p>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              aria-label={`تعديل ${project.name}`}
              title={t.projectsPage.card.editTitle}
              onClick={() => onEdit(project)}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
            >
              <Pencil size={16} />
            </button>
            <button
              type="button"
              aria-label={`حذف ${project.name}`}
              title={t.projectsPage.card.deleteTitle}
              disabled={isDeleting}
              onClick={() => onDelete(project)}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50 dark:hover:bg-slate-800"
            >
              {isDeleting ? (
                <Spinner size="sm" className="p-0" />
              ) : (
                <Trash2 size={16} />
              )}
            </button>
          </div>
        </div>
        <p className="mt-4 min-h-10 text-sm leading-5 text-slate-500 dark:text-slate-400">
          {project.description || t.projectsPage.card.noDescription}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {project.stats.totalTodos} {t.projectsPage.card.tasksCount}{" "}
          <span className="px-1 text-slate-300">·</span>{" "}
          {project.stats.backlogCount} {t.projectsPage.card.backlogCount}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/projects/${project.id}/board`)}
          rightIcon={<ArrowRight size={14} />}
        >
          {t.projectsPage.card.boardButton}
        </Button>
      </div>
    </article>
  );
}
