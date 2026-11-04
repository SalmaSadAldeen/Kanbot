import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import type { Todo } from "../../../types/api";
import { TypeIcon } from "../../todos/components/TypeIcon";
import { PriorityBadge } from "../../todos/components/PriorityBadge";

interface TodoCardProps {
  todo: Todo;
  /** Opens the TodoDetailsDialog for this card */
  onOpen: (todo: Todo) => void;
  /** True while a move mutation is in-flight (dims the card slightly) */
  isMoving?: boolean;
}

export function TodoCard({ todo, onOpen, isMoving = false }: TodoCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: todo.id,
    data: { todo },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        "group relative flex flex-col gap-3 rounded-xl border bg-white p-3.5 shadow-sm",
        "transition-all duration-150 select-none",
        "dark:bg-slate-800/90",
        isDragging
          ? "scale-[1.03] border-indigo-400 shadow-xl shadow-indigo-500/20 opacity-90 z-50 dark:border-indigo-500"
          : "border-slate-200 hover:border-indigo-300 hover:shadow-md dark:border-slate-700 dark:hover:border-indigo-600",
        isMoving && !isDragging ? "opacity-60" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* ── Top row: drag handle + key + type icon ── */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          {/* Drag handle — touch-friendly 24×24 hit area */}
          <button
            type="button"
            {...attributes}
            {...listeners}
            aria-label="Drag card"
            className="flex h-6 w-6 shrink-0 cursor-grab items-center justify-center rounded text-slate-300 transition-colors hover:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:cursor-grabbing dark:text-slate-600 dark:hover:text-slate-400"
          >
            <GripVertical size={14} strokeWidth={2} />
          </button>

          {/* Task key badge */}
          <span className="font-mono text-[11px] font-semibold text-slate-400 dark:text-slate-500">
            {todo.key}
          </span>
        </div>

        {/* Type icon, right-aligned */}
        <TypeIcon type={todo.type} />
      </div>

      {/* ── Title — clickable to open details ── */}
      <button
        type="button"
        onClick={() => onOpen(todo)}
        className="w-full text-start text-sm font-semibold leading-snug text-slate-800 transition-colors hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-200 dark:hover:text-indigo-400"
      >
        {todo.title}
      </button>

      {/* ── Bottom row: priority badge + points ── */}
      <div className="flex items-center justify-between gap-2">
        <PriorityBadge priority={todo.priority} />

        {todo.storyPoints !== null && (
          <span className="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
            {todo.storyPoints} pts
          </span>
        )}
      </div>

      {/* Due date indicator — only when set */}
      {todo.dueDate && (
        <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
          Due {todo.dueDate}
        </p>
      )}
    </div>
  );
}
