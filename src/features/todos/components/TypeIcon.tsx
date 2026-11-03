import { CheckSquare, Bookmark, Bug } from "lucide-react";
import type { TodoType } from "../../../types/api";
import { useTranslation } from "../../../store/useAppStore";

interface TypeIconProps {
  type: TodoType;
}

export function TypeIcon({ type }: TypeIconProps) {
  const { t } = useTranslation();

  const config: Record<TodoType, { icon: typeof CheckSquare; color: string }> =
    {
      task: {
        icon: CheckSquare,
        color: "text-blue-600 dark:text-blue-400",
      },
      story: {
        icon: Bookmark,
        color: "text-emerald-600 dark:text-emerald-400",
      },
      bug: {
        icon: Bug,
        color: "text-rose-600 dark:text-rose-400",
      },
    };

  const current = config[type] || config.task;
  const Icon = current.icon;
  const label = t.projectsPage.backlogPage.typeLabels?.[type] || type;

  return (
    <span
      className={`inline-flex items-center justify-center ${current.color}`}
      title={label}
    >
      <Icon size={15} />
    </span>
  );
}
