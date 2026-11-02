import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import {
  ArrowRight,
  CheckCircle2,
  Pencil,
  Trash2,
  RotateCcw,
} from "lucide-react";
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
  const { t, isRtl } = useTranslation();

  const [isPendingDelete, setIsPendingDelete] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDeleteClick = () => {
    setIsPendingDelete(true);

    timeoutRef.current = setTimeout(() => {
      onDelete(project);
      setIsPendingDelete(false);
    }, 4000);
  };

  const handleUndoClick = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsPendingDelete(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <article
      className={`group flex min-h-56 flex-col justify-between rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 dark:bg-slate-900 ${
        isPendingDelete
          ? "border-rose-300 bg-rose-50/60 dark:border-rose-900/60 dark:bg-rose-950/20"
          : "border-slate-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:hover:border-indigo-800"
      }`}
    >
      <div className="min-w-0">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 min-w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 px-2 text-xs font-extrabold tracking-wide text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/60 dark:text-indigo-300">
            {project.key}
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <h2
              className="truncate text-sm font-bold text-slate-900 dark:text-slate-100"
              title={project.name}
            >
              {project.name}
            </h2>
            {project.stats.activeSprint ? (
              <p className="mt-1 flex min-w-0 items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={13} className="shrink-0" />
                <span className="truncate">
                  {project.stats.activeSprint.name}
                </span>
              </p>
            ) : (
              <p className="mt-1 truncate text-xs text-slate-400 dark:text-slate-500">
                {t.projectsPage.card.noActiveSprint}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {isPendingDelete ? (
              <button
                type="button"
                onClick={handleUndoClick}
                className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 animate-pulse"
                title="تراجع عن الحذف"
              >
                <RotateCcw size={13} />
                <span>{isRtl ? "تراجع" : "Undo"}</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  aria-label={`${t.projectsPage.card.editTitle}: ${project.name}`}
                  title={t.projectsPage.card.editTitle}
                  onClick={() => onEdit(project)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                >
                  <Pencil size={15} />
                </button>
                <button
                  type="button"
                  aria-label={`${t.projectsPage.card.deleteTitle}: ${project.name}`}
                  title={t.projectsPage.card.deleteTitle}
                  disabled={isDeleting}
                  onClick={handleDeleteClick}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 disabled:opacity-50 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                >
                  {isDeleting ? (
                    <Spinner size="sm" className="p-0" />
                  ) : (
                    <Trash2 size={15} />
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        <p className="mt-4 line-clamp-2 min-h-10 break-words text-sm leading-5 text-slate-500 dark:text-slate-400">
          {project.description || t.projectsPage.card.noDescription}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <span className="text-xs tabular-nums text-slate-500 dark:text-slate-400">
          {project.stats.totalTodos}
          {t.projectsPage.card.tasksCount}
          <span className="mx-1.5 text-slate-300 dark:text-slate-600">·</span>
          {project.stats.backlogCount}
          {t.projectsPage.card.backlogCount}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/projects/${project.id}/board`)}
          rightIcon={
            <ArrowRight size={14} className={isRtl ? "rotate-180" : ""} />
          }
        >
          {t.projectsPage.card.boardButton}
        </Button>
      </div>
    </article>
  );
}
