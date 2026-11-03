import { useState, useEffect, useRef } from "react";
import { RotateCcw } from "lucide-react";
import type { Todo } from "../../types/api";
import { useTranslation } from "../../store/useAppStore";
import { Button } from "../../components/ui/Button";
import { Dialog } from "../../components/ui/Dialog";
import { Spinner } from "../../components/ui/Spinner";
import { TypeIcon } from "./components/TypeIcon";
import { PriorityBadge } from "./components/PriorityBadge";
import { TodoActionsMenu } from "./components/TodoActionsMenu";

interface TodoRowProps {
  todo: Todo;
  moreLabel: string;
  className?: string;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: (todo: Todo) => void;
}

export function TodoRow({
  todo,
  moreLabel,
  className = "",
  onSelect,
  onEdit,
  onDelete,
}: TodoRowProps) {
  const { t, isRtl } = useTranslation();
  const deleteCopy = t.projectsPage.deleteConfirm;

  const [isPendingDelete, setIsPendingDelete] = useState<boolean>(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] =
    useState<boolean>(false);
  const [isDeletingActive, setIsDeletingActive] = useState<boolean>(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      await onDelete(todo);
      setIsConfirmDialogOpen(false);
    } finally {
      setIsDeletingActive(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <>
      <div
        onClick={onSelect}
        className={`grid grid-cols-[1.25rem_auto_minmax(12rem,1fr)_auto_auto_auto_auto] items-center gap-4 px-4 py-3 transition-colors duration-200 cursor-pointer outline-none focus:outline-none ring-0 focus:ring-0 animate-in fade-in duration-200 max-sm:grid-cols-[1.25rem_minmax(4rem,auto)_minmax(5rem,1fr)_auto] max-sm:gap-2 ${className} ${
          isPendingDelete
            ? "border border-amber-300 bg-amber-50/60 dark:border-amber-900/60 dark:bg-amber-950/20 rounded-xl"
            : "hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
        }`}
      >
        <span
          aria-hidden="true"
          className="cursor-grab select-none text-slate-400 dark:text-slate-600"
        >
          ⠿
        </span>
        <span className="font-mono text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          {todo.key}
        </span>
        <span
          className="min-w-0 truncate text-sm font-medium text-slate-800 dark:text-slate-200 pe-2"
          title={todo.title}
        >
          {todo.title}
        </span>
        <span className="flex justify-center px-1">
          <TypeIcon type={todo.type} />
        </span>

        {/* شارة الأولوية متباعدة وبارزة */}
        <span className="max-sm:hidden px-2">
          <PriorityBadge priority={todo.priority} />
        </span>

        {/* شارة النقاط متباعدة وبارزة */}
        <span className="max-sm:hidden flex items-center justify-center px-1">
          <span className="inline-flex h-7 min-w-12 items-center justify-center rounded-md border border-slate-200 bg-slate-100 px-2.5 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 shadow-2xs">
            {todo.storyPoints ?? "-"}
          </span>
        </span>

        <div
          className="flex justify-center items-center ps-1"
          onClick={(e) => e.stopPropagation()}
        >
          {isPendingDelete ? (
            <button
              type="button"
              onClick={handleUndoClick}
              className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1 text-xs font-bold text-white shadow-sm transition hover:bg-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 animate-pulse cursor-pointer"
              title={isRtl ? "تراجع عن الحذف" : "Undo delete"}
            >
              <RotateCcw size={13} />
              <span>{isRtl ? "تراجع" : "Undo"}</span>
            </button>
          ) : (
            <TodoActionsMenu
              onEdit={onEdit}
              onDelete={handleDeleteClick}
              moreLabel={moreLabel}
            />
          )}
        </div>
      </div>

      <Dialog
        isOpen={isConfirmDialogOpen}
        onClose={() => !isDeletingActive && setIsConfirmDialogOpen(false)}
        title={deleteCopy.title}
      >
        <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {deleteCopy.message.replace("{name}", todo.title ?? "")}
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