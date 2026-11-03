import { useState, useRef, useEffect } from "react";
import {
  Play,
  MoreHorizontal,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronRight,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import type { Sprint, Todo, StartSprintRequest } from "../../../types/api";
import { useTranslation } from "../../../store/useAppStore";
import { Button } from "../../../components/ui/Button";
import { Dialog } from "../../../components/ui/Dialog";
import { Spinner } from "../../../components/ui/Spinner";
import { StartSprintDialog } from "./StartSprintDialog";

interface SprintHeaderProps {
  sprint: Sprint;
  todos: Todo[];
  allSprints?: Sprint[];
  isCollapsed: boolean;
  onToggle: () => void;
  onEditSprint: (sprint: Sprint) => void;
  onDeleteSprint: (sprintId: string) => void;
  onStartSprint: (sprintId: string, data: StartSprintRequest) => Promise<void>;
}

export function SprintHeader({
  sprint,
  todos,
  allSprints = [],
  isCollapsed,
  onToggle,
  onEditSprint,
  onDeleteSprint,
  onStartSprint,
}: SprintHeaderProps) {
  const { t, isRtl } = useTranslation();
  const copy = t.projectsPage.backlogPage;
  const deleteCopy = t.projectsPage.deleteConfirm;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStartDialogOpen, setIsStartDialogOpen] = useState(false);
  const [isStartPending, setIsStartPending] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [isPendingDelete, setIsPendingDelete] = useState<boolean>(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] =
    useState<boolean>(false);
  const [isDeletingActive, setIsDeletingActive] = useState<boolean>(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // الفحص الدقيق: هل يوجد أي سبرنت آخر في المشروع حالته active؟
  const hasActiveSprint = allSprints.some(
    (s) => s.status === "active" && s.id !== sprint.id,
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleDeleteClick = () => {
    setIsPendingDelete(true);
    timeoutRef.current = setTimeout(() => {
      setIsPendingDelete(false);
      setIsConfirmDialogOpen(true);
    }, 4000);
  };

  const handleUndoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsPendingDelete(false);
  };

  const handleConfirmDelete = async () => {
    setIsDeletingActive(true);
    try {
      await onDeleteSprint(sprint.id);
      setIsConfirmDialogOpen(false);
    } finally {
      setIsDeletingActive(false);
    }
  };

  const handleStartSubmit = async (data: StartSprintRequest) => {
    setIsStartPending(true);
    try {
      await onStartSprint(sprint.id, data);
      setIsStartDialogOpen(false);
    } finally {
      setIsStartPending(false);
    }
  };

  const stats = sprint.stats || {
    totalTodos: 0,
    doneTodos: 0,
    totalPoints: 0,
    donePoints: 0,
    byStatus: { todo: 0, in_progress: 0, in_review: 0, done: 0 },
  };

  const workItemsCount = todos.length;
  const workItemsText = `${workItemsCount} work item${workItemsCount !== 1 ? "s" : ""}`;

  return (
    <>
      <div
        className={`flex flex-wrap items-center justify-between gap-3 rounded-t-2xl border-b transition-all duration-200 px-4 py-3.5 ${
          isPendingDelete
            ? "border-amber-300 bg-amber-50/80 dark:border-amber-900/60 dark:bg-amber-950/30"
            : "border-slate-100 bg-gradient-to-r from-slate-50/80 via-white to-slate-50/50 dark:border-slate-800/60 dark:from-slate-800/40 dark:via-slate-900 dark:to-slate-800/20"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            type="button"
            onClick={onToggle}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            {isCollapsed ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-sm font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Sparkles size={14} className="text-indigo-500 animate-pulse" />
                {sprint.name}
              </h2>

              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                ({workItemsText})
              </span>
            </div>

            {sprint.goal && (
              <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                {sprint.goal}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isPendingDelete ? (
            <button
              type="button"
              onClick={handleUndoClick}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 animate-pulse cursor-pointer"
              title={isRtl ? "تراجع عن الحذف" : "Undo delete"}
            >
              <RotateCcw size={13} className="shrink-0" />
              <span>{isRtl ? "تراجع" : "Undo"}</span>
            </button>
          ) : (
            <>
              <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold">
                <span
                  title="To Do"
                  className="flex h-6 min-w-6 items-center justify-center rounded-md bg-slate-200/80 px-1.5 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  {stats.byStatus?.["todo"] ?? 0}
                </span>
                <span
                  title="In Progress"
                  className="flex h-6 min-w-6 items-center justify-center rounded-md bg-blue-600 px-1.5 text-white"
                >
                  {(stats.byStatus?.["in_progress"] ?? 0) +
                    (stats.byStatus?.["in_review"] ?? 0)}
                </span>
                <span
                  title="Done"
                  className="flex h-6 min-w-6 items-center justify-center rounded-md bg-emerald-600 px-1.5 text-white"
                >
                  {stats.byStatus?.["done"] ?? 0}
                </span>
              </div>

              {/* زر البدء مع التعطيل البرمجي والبصري إذا وجد سبرنت نشط */}
              {/* زر البدء مع رسالة توضيحية تظهر عند مرور الماوس (Hover) إذا كان معطلاً */}
              <button
                type="button"
                disabled={hasActiveSprint}
                onClick={() => !hasActiveSprint && setIsStartDialogOpen(true)}
                title={
                  hasActiveSprint
                    ? copy.startSprintDialog.activeSprintWarning
                    : ""
                }
                className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-emerald-200 bg-emerald-50/90 px-3 py-1.5 text-xs font-bold text-emerald-700 shadow-sm transition-all dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400 ${
                  hasActiveSprint
                    ? "opacity-40 cursor-not-allowed bg-slate-100 border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500"
                    : "hover:bg-emerald-100 cursor-pointer"
                }`}
              >
                <Play size={13} className="shrink-0 fill-current" />
                <span>{copy.startSprint}</span>
              </button>
            </>
          )}

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            >
              <MoreHorizontal size={16} />
            </button>

            {isMenuOpen && (
              <div className="absolute end-0 z-50 mt-2 w-44 rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onEditSprint(sprint);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100/80 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <Edit2 size={13} className="text-indigo-500" />
                  <span>{copy.editSprint}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleDeleteClick();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30 cursor-pointer"
                >
                  <Trash2 size={13} />
                  <span>{copy.deleteSprint}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <StartSprintDialog
        isOpen={isStartDialogOpen}
        isPending={isStartPending}
        hasActiveSprint={hasActiveSprint}
        onClose={() => setIsStartDialogOpen(false)}
        onSubmit={handleStartSubmit}
      />

      <Dialog
        isOpen={isConfirmDialogOpen}
        onClose={() => !isDeletingActive && setIsConfirmDialogOpen(false)}
        title={deleteCopy.title}
      >
        <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {deleteCopy.message.replace("{name}", sprint.name ?? "")}
          </p>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button
              variant="secondary"
              onClick={() => setIsConfirmDialogOpen(false)}
              disabled={isDeletingActive}
            >
              {deleteCopy.cancel}
            </Button>
            <Button
              variant="danger"
              onClick={() => void handleConfirmDelete()}
              disabled={isDeletingActive}
            >
              {isDeletingActive ? <Spinner size="sm" /> : deleteCopy.confirm}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
