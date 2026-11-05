import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Todo, TodoStatus } from "../../../types/api";
import { TodoCard } from "./TodoCard";
import { useTranslation } from "../../../store/useAppStore";

// ── Per-column visual identity ───────────────────────────────────────────────
//
// Each column has:
//   • headerBg / headerText  — the title strip
//   • countBg / countText    — the task-count pill
//   • bodyBg                 — the scrollable card area (at rest)
//   • overBg                 — card area when a card is being dragged over it
//   • overRing               — outline ring when dragged over
//   • accentBar              — 2px top line on the column header (Jira cue)
//
const COLUMN_STYLE: Record<
  TodoStatus,
  {
    headerBg: string;
    headerText: string;
    countBg: string;
    countText: string;
    bodyBg: string;
    overBg: string;
    overRing: string;
    accentBar: string;
  }
> = {
  todo: {
    headerBg: "bg-slate-100 dark:bg-slate-800/80",
    headerText: "text-slate-700 dark:text-slate-300",
    countBg: "bg-slate-300/60 dark:bg-slate-700",
    countText: "text-slate-600 dark:text-slate-400",
    bodyBg: "bg-slate-100/60 dark:bg-slate-900/40",
    overBg: "bg-slate-200/80 dark:bg-slate-800/60",
    overRing: "ring-2 ring-inset ring-slate-400/50 dark:ring-slate-600",
    accentBar: "bg-slate-400 dark:bg-slate-500",
  },
  in_progress: {
    headerBg: "bg-blue-50 dark:bg-blue-950/40",
    headerText: "text-blue-700 dark:text-blue-300",
    countBg: "bg-blue-200/60 dark:bg-blue-900/60",
    countText: "text-blue-700 dark:text-blue-400",
    bodyBg: "bg-blue-50/40 dark:bg-blue-950/20",
    overBg: "bg-blue-100/80 dark:bg-blue-950/50",
    overRing: "ring-2 ring-inset ring-blue-300 dark:ring-blue-700",
    accentBar: "bg-blue-500 dark:bg-blue-400",
  },
  in_review: {
    headerBg: "bg-amber-50 dark:bg-amber-950/40",
    headerText: "text-amber-700 dark:text-amber-300",
    countBg: "bg-amber-200/60 dark:bg-amber-900/60",
    countText: "text-amber-700 dark:text-amber-400",
    bodyBg: "bg-amber-50/40 dark:bg-amber-950/20",
    overBg: "bg-amber-100/80 dark:bg-amber-950/50",
    overRing: "ring-2 ring-inset ring-amber-300 dark:ring-amber-700",
    accentBar: "bg-amber-500 dark:bg-amber-400",
  },
  done: {
    headerBg: "bg-emerald-50 dark:bg-emerald-950/40",
    headerText: "text-emerald-700 dark:text-emerald-300",
    countBg: "bg-emerald-200/60 dark:bg-emerald-900/60",
    countText: "text-emerald-700 dark:text-emerald-400",
    bodyBg: "bg-emerald-50/40 dark:bg-emerald-950/20",
    overBg: "bg-emerald-100/80 dark:bg-emerald-950/50",
    overRing: "ring-2 ring-inset ring-emerald-300 dark:ring-emerald-700",
    accentBar: "bg-emerald-500 dark:bg-emerald-400",
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
  const { t } = useTranslation();
  const bd = t.projectsPage.boardPage;

  // Column labels & empty states from i18n — never raw backend strings
  const label = bd.columns[status];
  const emptyLabel = bd.columnEmpty[status];

  const style = COLUMN_STYLE[status];

  const { setNodeRef, isOver } = useDroppable({ id: status });
  const cardIds = todos.map((t) => t.id);

  return (
    <div className="flex min-w-[220px] flex-1 flex-col">

      {/* ── Column header ─────────────────────────────────────────────────── */}
      <div
        className={`mb-2 overflow-hidden rounded-xl ${style.headerBg}`}
      >
        {/* Top accent bar */}
        <div className={`h-[3px] w-full ${style.accentBar}`} />

        <div className="flex items-center justify-between px-3 py-2.5">
          <span
            className={`text-xs font-extrabold uppercase tracking-widest ${style.headerText}`}
          >
            {label}
          </span>
          {/* Task count pill */}
          <span
            className={`min-w-[22px] rounded-full px-2 py-0.5 text-center text-[10px] font-extrabold tabular-nums ${style.countBg} ${style.countText}`}
          >
            {todos.length}
          </span>
        </div>
      </div>

      {/* ── Drop zone ─────────────────────────────────────────────────────── */}
      <div
        ref={setNodeRef}
        className={[
          "flex flex-1 flex-col gap-2 rounded-xl p-2",
          "min-h-[180px] transition-colors duration-150",
          isOver ? `${style.overBg} ${style.overRing}` : style.bodyBg,
        ].join(" ")}
      >
        <SortableContext
          items={cardIds}
          strategy={verticalListSortingStrategy}
        >
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
            // Empty column placeholder — styled like Jira's subtle drop hint
            <div
              className={[
                "flex flex-1 items-center justify-center rounded-lg",
                "border-2 border-dashed py-10",
                isOver
                  ? "border-indigo-300 dark:border-indigo-700"
                  : "border-slate-200 dark:border-slate-800",
              ].join(" ")}
            >
              <p className="text-[11px] font-medium text-slate-400 dark:text-slate-600">
                {emptyLabel}
              </p>
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}
