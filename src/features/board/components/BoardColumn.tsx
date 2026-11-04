import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Todo, TodoStatus } from "../../../types/api";
import { TodoCard } from "./TodoCard";

/** Visual config per column — mirrors Jira's colour language */
const COLUMN_CONFIG: Record<
  TodoStatus,
  { label: string; headerColor: string; dotColor: string; emptyLabel: string }
> = {
  todo: {
    label: "To Do",
    headerColor:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    dotColor: "bg-slate-400 dark:bg-slate-500",
    emptyLabel: "No tasks yet",
  },
  in_progress: {
    label: "In Progress",
    headerColor:
      "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
    dotColor: "bg-blue-400 dark:bg-blue-500",
    emptyLabel: "Nothing in progress",
  },
  in_review: {
    label: "In Review",
    headerColor:
      "bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300",
    dotColor: "bg-violet-400 dark:bg-violet-500",
    emptyLabel: "Nothing to review",
  },
  done: {
    label: "Done",
    headerColor:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    dotColor: "bg-emerald-400 dark:bg-emerald-500",
    emptyLabel: "Nothing completed yet",
  },
};

interface BoardColumnProps {
  status: TodoStatus;
  todos: Todo[];
  onOpenTodo: (todo: Todo) => void;
  isMoving?: boolean;
}

export function BoardColumn({
  status,
  todos,
  onOpenTodo,
  isMoving = false,
}: BoardColumnProps) {
  const config = COLUMN_CONFIG[status];

  // Makes the whole column a drop zone for dnd-kit
  const { setNodeRef, isOver } = useDroppable({ id: status });

  const cardIds = todos.map((t) => t.id);

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      {/* ── Column header ── */}
      <div
        className={`mb-3 flex items-center justify-between rounded-xl px-3 py-2 ${config.headerColor}`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${config.dotColor}`}
          />
          <span className="text-xs font-extrabold uppercase tracking-wider">
            {config.label}
          </span>
        </div>
        <span className="min-w-[1.5rem] rounded-full bg-white/60 px-2 py-0.5 text-center text-[11px] font-bold dark:bg-slate-900/40">
          {todos.length}
        </span>
      </div>

      {/* ── Drop zone + card list ── */}
      <div
        ref={setNodeRef}
        className={[
          "flex flex-1 flex-col gap-2.5 rounded-xl p-2 transition-colors duration-150",
          "min-h-[120px]",
          isOver
            ? "bg-indigo-50/80 ring-2 ring-inset ring-indigo-300 dark:bg-indigo-950/30 dark:ring-indigo-600"
            : "bg-slate-100/50 dark:bg-slate-900/30",
        ].join(" ")}
      >
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {todos.length > 0 ? (
            todos.map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onOpen={onOpenTodo}
                isMoving={isMoving}
              />
            ))
          ) : (
            <div className="flex flex-1 items-center justify-center py-8">
              <p className="text-xs font-medium text-slate-400 dark:text-slate-600">
                {config.emptyLabel}
              </p>
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}
