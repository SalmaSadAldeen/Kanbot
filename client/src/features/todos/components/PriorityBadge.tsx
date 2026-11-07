import { ChevronsUp, ChevronUp, Minus, ChevronDown } from "lucide-react";
import type { TodoPriority } from "../../../types/api";
import { useTranslation } from "../../../store/useAppStore";

interface PriorityBadgeProps {
  priority: TodoPriority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const { t } = useTranslation();

  // ألوان وتصاميم مطابقة لـ Jira تماماً (أيقونات واضحة مع خلفيات مميزة)
  const config: Record<
    TodoPriority,
    { icon: typeof ChevronsUp; color: string }
  > = {
    urgent: {
      icon: ChevronsUp,
      color: "text-red-700 bg-red-100/80 dark:bg-red-950/60 dark:text-red-400",
    },
    high: {
      icon: ChevronUp,
      color:
        "text-orange-700 bg-orange-100/80 dark:bg-orange-950/60 dark:text-orange-400",
    },
    medium: {
      icon: Minus,
      color:
        "text-amber-700 bg-amber-100/80 dark:bg-amber-950/60 dark:text-amber-400",
    },
    low: {
      icon: ChevronDown,
      color:
        "text-blue-700 bg-blue-100/80 dark:bg-blue-950/60 dark:text-blue-400",
    },
  };

  const current = config[priority] || config.medium;
  const Icon = current.icon;
  const label =
    t.projectsPage.backlogPage.priorityLabels?.[priority] || priority;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-[12px] font-bold ${current.color}`}
      title={label}
    >
      <Icon size={13} className="shrink-0 stroke-[2.5]" />
      <span>{label}</span>
    </span>
  );
}
