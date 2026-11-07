import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  CheckSquare2,
  Bookmark,
  Bug,
  ChevronsUp,
  ChevronUp,
  Minus,
  AlertCircle,
} from "lucide-react";
import type { Todo, TodoType, TodoPriority } from "../../../types/api";
import { useTranslation } from "../../../store/useAppStore";

interface TodoCardProps {
  todo: Todo;
  onOpen: (todo: Todo) => void;
  isMoving?: boolean;
}

const TYPE_CONFIG: Record<
  TodoType,
  { icon: React.ElementType; bg: string; text: string; label: string }
> = {
  task: {
    icon: CheckSquare2,
    bg: "bg-blue-50 dark:bg-blue-950/60",
    text: "text-blue-700 dark:text-blue-400",
    label: "Task",
  },
  story: {
    icon: Bookmark,
    bg: "bg-emerald-50 dark:bg-emerald-950/60",
    text: "text-emerald-700 dark:text-emerald-400",
    label: "Story",
  },
  bug: {
    icon: Bug,
    bg: "bg-rose-50 dark:bg-rose-950/60",
    text: "text-rose-700 dark:text-rose-400",
    label: "Bug",
  },
};

const PRIORITY_CONFIG: Record<
  TodoPriority,
  { icon: React.ElementType; color: string; label: string }
> = {
  urgent: {
    icon: AlertCircle,
    color: "text-rose-600 dark:text-rose-400",
    label: "Urgent",
  },
  high: {
    icon: ChevronsUp,
    color: "text-orange-500 dark:text-orange-400",
    label: "High",
  },
  medium: {
    icon: ChevronUp,
    color: "text-amber-500 dark:text-amber-400",
    label: "Medium",
  },
  low: {
    icon: Minus,
    color: "text-blue-400 dark:text-blue-400",
    label: "Low",
  },
};

function TypeBadge({ type }: { type: TodoType }) {
  const { t } = useTranslation();
  const cfg = TYPE_CONFIG[type] ?? TYPE_CONFIG.task;
  const Icon = cfg.icon;
  const label = t.projectsPage.backlogPage.typeLabels?.[type] ?? cfg.label;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${cfg.bg} ${cfg.text}`}
      title={label}
    >
      <Icon size={11} strokeWidth={2.5} />
      {label}
    </span>
  );
}

function PriorityIcon({ priority }: { priority: TodoPriority }) {
  const { t } = useTranslation();
  const cfg = PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.medium;
  const Icon = cfg.icon;
  const label =
    t.projectsPage.backlogPage.priorityLabels?.[priority] ?? cfg.label;
  return (
    <span title={label} className={`flex items-center ${cfg.color}`}>
      <Icon size={15} strokeWidth={2.5} />
    </span>
  );
}

export function TodoCard({ todo, onOpen, isMoving = false }: TodoCardProps) {
  const { t } = useTranslation();
  const pts = t.projectsPage.boardPage.pts;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id, data: { todo } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // لون الشريط الجانبي حسب نوع المهمة
  const stripeColor =
    todo.type === "bug"
      ? "bg-rose-500"
      : todo.type === "story"
        ? "bg-emerald-500"
        : "bg-blue-500";

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => {
        if (isDragging) return;
        onOpen(todo);
      }}
      className={[
        "group relative flex flex-col overflow-hidden rounded-xl border bg-white cursor-pointer",
        "select-none transition-all duration-200",
        "dark:bg-slate-900 dark:border-slate-800",
        isDragging
          ? "z-50 scale-[1.02] border-indigo-400 shadow-xl shadow-indigo-500/20 opacity-90 dark:border-indigo-500"
          : [
              "border-slate-200/90 shadow-2xs",
              "hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md",
              "dark:hover:border-indigo-600 dark:hover:bg-slate-800/80",
              isMoving ? "opacity-50" : "",
            ].join(" "),
      ]
        .flat()
        .filter(Boolean)
        .join(" ")}
    >
      {/* Left accent stripe (مدمج داخل الحدود بشكل نظامي) */}
      <div className={`absolute inset-y-0 start-0 w-1 ${stripeColor}`} />

      {/* المحتوى الداخلي مع مسافة كافية للشريط الجانبي */}
      <div className="flex flex-col gap-3 p-3.5 ps-4">
        {/* Row 1: key + type badge + drag handle */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-mono text-[10px] font-bold text-slate-400 dark:text-slate-500 shrink-0">
              {todo.key}
            </span>
            <TypeBadge type={todo.type} />
          </div>

          {/* Drag handle */}
          <div
            {...attributes}
            {...listeners}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            aria-label="Drag card handle"
            className={[
              "flex h-6 w-6 shrink-0 cursor-grab items-center justify-center rounded-lg",
              "text-slate-400 transition-colors focus:outline-none",
              "hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300",
              "active:cursor-grabbing",
            ].join(" ")}
          >
            <GripVertical size={14} strokeWidth={2} />
          </div>
        </div>

        {/* Row 2: Title */}
        <div className="w-full text-start text-[13px] font-semibold leading-relaxed line-clamp-2 text-slate-800 dark:text-slate-100">
          {todo.title}
        </div>

        {/* Row 3: priority icon + points */}
        <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-2.5 dark:border-slate-800/80">
          <PriorityIcon priority={todo.priority} />

          {todo.storyPoints !== null && (
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold tabular-nums text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {todo.storyPoints}&nbsp;{pts}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
