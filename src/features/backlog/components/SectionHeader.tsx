import { ChevronDown, ChevronRight } from "lucide-react";
import { useTranslation } from "../../../store/useAppStore";

interface SectionHeaderProps {
  title: string;
  count: number;
  points: number;
  countLabel: string;
  pointsLabel: string;
  isCollapsed: boolean;
  onToggle: () => void;
}

export function SectionHeader({
  title,
  count,
  points,
  countLabel,
  pointsLabel,
  isCollapsed,
  onToggle,
}: SectionHeaderProps) {
  // جلب اتجاه اللغة مباشرة من الهوك دون المساس بالترجمة أو الـ copy
  const { isRtl } = useTranslation();

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 px-4 py-3 dark:bg-slate-900/80 ${
        !isCollapsed ? "border-b border-slate-200/80 dark:border-slate-800" : ""
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={!isCollapsed}
        className="flex min-w-0 flex-1 items-center gap-2.5 text-start group cursor-pointer outline-none focus:outline-none"
      >
        <span className="text-slate-400 transition-transform group-hover:text-slate-600 dark:group-hover:text-slate-200">
          {/* انعكاس الأيقونة تلقائياً بناءً على الـ isRtl وحالة الطي */}
          {isCollapsed ? (
            isRtl ? (
              <ChevronDown size={17} />
            ) : (
              <ChevronRight size={17} />
            )
          ) : (
            <ChevronDown size={17} />
          )}
        </span>
        <span className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
          {title}
        </span>
        <span className="shrink-0 rounded-full bg-slate-200/70 px-2.5 py-0.5 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {count} {countLabel} · {points} {pointsLabel}
        </span>
      </button>
    </div>
  );
}