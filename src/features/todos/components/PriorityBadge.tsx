import { ChevronsUp, ChevronUp, Minus, ChevronDown } from "lucide-react";
import type { TodoPriority } from "../../../types/api";
import { useTranslation } from "../../../store/useAppStore";

interface PriorityBadgeProps {
  priority: TodoPriority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const { t } = useTranslation();

  const config: Record<
    TodoPriority,
    { icon: typeof ChevronsUp; color: string }
  > = {
    urgent: {
      icon: ChevronsUp,
      color: "text-rose-600 bg-rose-50 dark:bg-rose-950/50 dark:text-rose-400",
    },
    high: {
      icon: ChevronUp,
      color:
        "text-amber-600 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-400",
    },
    medium: {
      icon: Minus,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/50 dark:text-blue-400",
    },
    low: {
      icon: ChevronDown,
      color:
        "text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400",
    },
  };

  const current = config[priority] || config.medium;
  const Icon = current.icon;
  const label =
    t.projectsPage.backlogPage.priorityLabels?.[priority] || priority;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold ${current.color}`}
      title={label}
    >
      <Icon size={13} />
      <span>{label}</span>
    </span>
  );
}
