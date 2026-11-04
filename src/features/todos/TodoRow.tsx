import { useState, useEffect, useRef } from "react";
import { RotateCcw } from "lucide-react";
import { useParams } from "react-router";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Todo } from "../../types/api";
import { useTranslation } from "../../store/useAppStore";
import { useTodos } from "../../hooks/useTodos";
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
  sprintOptions?: { id: string; name: string }[];
}

export function TodoRow({
  todo,
  moreLabel,
  className = "",
  onSelect,
  onEdit,
  sprintOptions = [],
}: TodoRowProps) {
  const { projectId } = useParams<{ projectId: string }>();
  const { t, isRtl } = useTranslation();
  const deleteCopy = t.projectsPage.deleteConfirm;
  const {
    moveTodo,
    deleteTodo,
    todos: currentList = [],
  } = useTodos(projectId, todo.sprintId ?? "backlog");
  const { todos: backlogList = [] } = useTodos(projectId, "backlog");

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.4 : 1,
  };

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
      if (projectId) {
        await deleteTodo(todo.id);
      }
      setIsConfirmDialogOpen(false);
    } finally {
      setIsDeletingActive(false);
    }
  };

  const handleMove = async (
    targetSprintId: string | null,
    targetPosition: number,
    targetStatus?: Todo["status"],
  ) => {
    if (!projectId) return;
    await moveTodo({
      todoId: todo.id,
      data: {
        sprintId: targetSprintId,
        status: targetStatus ?? todo.status,
        position: Math.max(0, targetPosition),
      },
    });
  };

  const handleMoveToTop = async () => {
    await handleMove(todo.sprintId ?? null, 0);
  };

  const handleMoveToBottom = async () => {
    await handleMove(
      todo.sprintId ?? null,
      Math.max(0, currentList.length - 1),
    );
  };

  const handleMoveToBacklog = async () => {
    await handleMove(null, backlogList.length);
  };

  const handleMoveToSprint = async (targetSprintId: string) => {
    await handleMove(targetSprintId, Number.MAX_SAFE_INTEGER);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [],);

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        onClick={onSelect}
        className={`grid grid-cols-[1.25rem_auto_minmax(0,1fr)_auto] items-center gap-2 px-3 py-3 transition-colors duration-200 cursor-pointer outline-none focus:outline-none ring-0 focus:ring-0 sm:grid-cols-[1.25rem_auto_minmax(12rem,1fr)_auto_auto_auto_auto] sm:gap-4 sm:px-4 ${className} ${
          isPendingDelete
            ? "border border-amber-300 bg-amber-50/60 dark:border-amber-900/60 dark:bg-amber-950/20 rounded-xl"
            : "hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
        }`}
      >
        <span
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
          className="cursor-grab active:cursor-grabbing select-none text-slate-400 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-400 transition-colors p-1"
          onClick={(e) => e.stopPropagation()}
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

        <span className="max-sm:hidden px-2">
          <PriorityBadge priority={todo.priority} />
        </span>

        <span className="max-sm:hidden flex items-center justify-center px-1">
          <span className="inline-flex h-7 min-w-12 items-center justify-center rounded-md border border-slate-200 bg-slate-100 px-2.5 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 shadow-2xs">
            {todo.storyPoints ?? "-"}
          </span>
        </span>

        <div
          className="flex justify-center items-center ps-1 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {isPendingDelete ? (
            <button
              type="button"
              onClick={handleUndoClick}
              className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1 text-xs font-bold text-white shadow-sm transition hover:bg-amber-700 animate-pulse cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>{isRtl ? "تراجع" : "Undo"}</span>
            </button>
          ) : (
            <TodoActionsMenu
              onEdit={onEdit}
              onDelete={handleDeleteClick}
              onMoveToTop={handleMoveToTop}
              onMoveToBottom={handleMoveToBottom}
              onMoveToBacklog={todo.sprintId ? handleMoveToBacklog : undefined}
              onMoveToSprint={handleMoveToSprint}
              sprintOptions={sprintOptions}
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
