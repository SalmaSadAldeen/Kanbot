import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Todo, TodoStatus } from "../../../types/api";
import { TodoCard } from "./TodoCard";
import { useTranslation } from "../../../store/useAppStore";

// ── Per-column visual identity ───────────────────────────────────────────────
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
    headerBg: "bg-slate-100/90 dark:bg-slate-800/90",
    headerText: "text-slate-700 dark:text-slate-300",
    countBg: "bg-slate-200 dark:bg-slate-700",
    countText: "text-slate-700 dark:text-slate-300",
    bodyBg: "bg-slate-50/70 dark:bg-slate-900/40",
    overBg: "bg-slate-100 dark:bg-slate-800/80",
    overRing: "ring-2 ring-inset ring-slate-400/50 dark:ring-slate-600",
    accentBar: "bg-slate-400 dark:bg-slate-500",
  },
  in_progress: {
    headerBg: "bg-blue-50/90 dark:bg-blue-950/50",
    headerText: "text-blue-700 dark:text-blue-300",
    countBg: "bg-blue-200/80 dark:bg-blue-900/60",
    countText: "text-blue-800 dark:text-blue-300",
    bodyBg: "bg-blue-50/30 dark:bg-blue-950/20",
    overBg: "bg-blue-100/80 dark:bg-blue-950/60",
    overRing: "ring-2 ring-inset ring-blue-300 dark:ring-blue-700",
    accentBar: "bg-blue-500 dark:bg-blue-400",
  },
  in_review: {
    headerBg: "bg-amber-50/90 dark:bg-amber-950/50",
    headerText: "text-amber-700 dark:text-amber-300",
    countBg: "bg-amber-200/80 dark:bg-amber-900/60",
    countText: "text-amber-800 dark:text-amber-300",
    bodyBg: "bg-amber-50/30 dark:bg-amber-950/20",
    overBg: "bg-amber-100/80 dark:bg-amber-950/60",
    overRing: "ring-2 ring-inset ring-amber-300 dark:ring-amber-700",
    accentBar: "bg-amber-500 dark:bg-amber-400",
  },
  done: {
    headerBg: "bg-emerald-50/90 dark:bg-emerald-950/50",
    headerText: "text-emerald-700 dark:text-emerald-300",
    countBg: "bg-emerald-200/80 dark:bg-emerald-900/60",
    countText: "text-emerald-800 dark:text-emerald-300",
    bodyBg: "bg-emerald-50/30 dark:bg-emerald-950/20",
    overBg: "bg-emerald-100/80 dark:bg-emerald-950/60",
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

  const label = bd.columns[status];
  const emptyLabel = bd.columnEmpty[status];
  const style = COLUMN_STYLE[status];

  const { setNodeRef, isOver } = useDroppable({ id: status });
  const cardIds = todos.map((item) => item.id);

  return (
    <div className="flex h-full min-h-0 min-w-[240px] flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white/60 shadow-xs backdrop-blur-xs dark:border-slate-800 dark:bg-slate-950/40">
      {/* ── Column header (ثابت) ── */}
      <div
        className={`shrink-0 overflow-hidden rounded-t-2xl border-b border-slate-200/60 dark:border-slate-800/80 ${style.headerBg}`}
      >
        <div className={`h-[3px] w-full ${style.accentBar}`} />

        <div className="flex items-center justify-between px-3.5 py-3">
          <span
            className={`text-xs font-black uppercase tracking-wider ${style.headerText}`}
          >
            {label}
          </span>
          <span
            className={`min-w-[24px] rounded-full px-2 py-0.5 text-center text-[10px] font-black tabular-nums shadow-2xs ${style.countBg} ${style.countText}`}
          >
            {todos.length}
          </span>
        </div>
      </div>

      {/* ── Drop zone (هاد بس اللي بيسكرول) ── */}
      <div
        ref={setNodeRef}
        className={[
          "flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto overscroll-contain rounded-b-2xl p-2.5",
          "transition-colors duration-200",
          isOver ? `${style.overBg} ${style.overRing}` : style.bodyBg,
        ].join(" ")}
      >
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {todos.length > 0 ? (
            todos.map((todo) => (
              <div key={todo.id} className="shrink-0">
                <TodoCard todo={todo} onOpen={onOpenTodo} isMoving={isMoving} />
              </div>
            ))
          ) : (
            <div
              className={[
                "flex flex-1 items-center justify-center rounded-xl",
                "border-2 border-dashed py-12 transition-colors",
                isOver
                  ? "border-indigo-400 bg-indigo-50/30 dark:border-indigo-600 dark:bg-indigo-950/20"
                  : "border-slate-200/80 dark:border-slate-800/80",
              ].join(" ")}
            >
              <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                {emptyLabel}
              </p>
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}
