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
    bg: "bg-blue-100 dark:bg-blue-950/60",
    text: "text-blue-700 dark:text-blue-400",
    label: "Task",
  },
  story: {
    icon: Bookmark,
    bg: "bg-emerald-100 dark:bg-emerald-950/60",
    text: "text-emerald-700 dark:text-emerald-400",
    label: "Story",
  },
  bug: {
    icon: Bug,
    bg: "bg-red-100 dark:bg-red-950/60",
    text: "text-red-700 dark:text-red-400",
    label: "Bug",
  },
};

const PRIORITY_CONFIG: Record<
  TodoPriority,
  { icon: React.ElementType; color: string; label: string }
> = {
  urgent: {
    icon: AlertCircle,
    color: "text-red-600 dark:text-red-400",
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
      className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold ${cfg.bg} ${cfg.text}`}
      title={label}
    >
      <Icon size={10} strokeWidth={2.5} />
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
    <span title={label} className={cfg.color}>
      <Icon size={14} strokeWidth={2.5} />
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => {
        if (isDragging) return;
        onOpen(todo);
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onOpen(todo);
        }
      }}
      className={[
        "group relative flex flex-col gap-0 rounded-xl border bg-white cursor-pointer",
        "select-none transition-all duration-150",
        "dark:bg-slate-800",
        isDragging
          ? "z-50 scale-[1.02] border-indigo-400 shadow-2xl shadow-indigo-500/30 opacity-95 dark:border-indigo-500"
          : [
              "border-slate-200 shadow-sm",
              "hover:-translate-y-px hover:border-indigo-300 hover:shadow-md",
              "dark:border-slate-700/80 dark:hover:border-indigo-600",
              isMoving ? "opacity-50" : "",
            ].join(" "),
      ]
        .flat()
        .filter(Boolean)
        .join(" ")}
    >
      {/* Left accent stripe */}
      <div
        className={[
          "absolute inset-y-0 left-0 w-[3px] rounded-l-xl",
          todo.type === "bug"
            ? "bg-red-400 dark:bg-red-500"
            : todo.type === "story"
              ? "bg-emerald-400 dark:bg-emerald-500"
              : "bg-blue-400 dark:bg-blue-500",
        ].join(" ")}
      />

      <div className="pl-3.5 pr-3 pt-3 pb-2.5 flex flex-col gap-2.5">
        {/* Row 1: key + type badge + drag handle */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-mono text-[10px] font-semibold text-slate-400 dark:text-slate-500 shrink-0">
              {todo.key}
            </span>
            <TypeBadge type={todo.type} />
          </div>

          {/* Drag handle — ظاهر دائماً الآن */}
          <div
            {...attributes}
            {...listeners}
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            aria-label="Drag card handle"
            className={[
              "flex h-6 w-5 shrink-0 cursor-grab items-center justify-center rounded",
              "text-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500",
              "hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700",
              "active:cursor-grabbing",
              "dark:text-slate-500 dark:hover:text-slate-300",
            ].join(" ")}
          >
            <GripVertical size={13} strokeWidth={2} />
          </div>
        </div>

        {/* Row 2: Title */}
        <div className="w-full text-start text-[13px] font-semibold leading-snug line-clamp-2 break-words text-slate-800 dark:text-slate-200">
          {todo.title}
        </div>

        {/* Row 3: priority icon + points */}
        <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-2 dark:border-slate-700/60">
          <PriorityIcon priority={todo.priority} />

          {todo.storyPoints !== null && (
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold tabular-nums text-slate-600 dark:bg-slate-700 dark:text-slate-300">
              {todo.storyPoints}&nbsp;{pts}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
