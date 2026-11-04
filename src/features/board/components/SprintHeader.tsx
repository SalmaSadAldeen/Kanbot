import { differenceInCalendarDays, parseISO } from "date-fns";
import { CalendarDays, Target, Sparkles, CheckCheck, Bot } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import type { Sprint } from "../../../types/api";

interface SprintHeaderProps {
  sprint: Sprint;
  onCompleteSprint: () => void;
  onSummarize: () => void;
  onAskAi: () => void;
  isCompleting?: boolean;
}

/** Format a YYYY-MM-DD date string for display, e.g. "Nov 3, 2026" */
function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  try {
    return parseISO(dateStr).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/** Returns days remaining (positive) or days overdue (negative). */
function daysLeft(endDate: string | null): number | null {
  if (!endDate) return null;
  try {
    return differenceInCalendarDays(parseISO(endDate), new Date());
  } catch {
    return null;
  }
}

export function SprintHeader({
  sprint,
  onCompleteSprint,
  onSummarize,
  onAskAi,
  isCompleting = false,
}: SprintHeaderProps) {
  const stats = sprint.stats;
  const pointsPct =
    stats.totalPoints > 0
      ? Math.round((stats.donePoints / stats.totalPoints) * 100)
      : 0;
  const todosPct =
    stats.totalTodos > 0
      ? Math.round((stats.doneTodos / stats.totalTodos) * 100)
      : 0;

  const remaining = daysLeft(sprint.endDate);
  const daysLabel =
    remaining === null
      ? "No end date"
      : remaining > 0
        ? `${remaining} day${remaining !== 1 ? "s" : ""} left`
        : remaining === 0
          ? "Due today"
          : `${Math.abs(remaining)} day${Math.abs(remaining) !== 1 ? "s" : ""} overdue`;

  const daysColor =
    remaining === null
      ? "text-slate-400"
      : remaining > 3
        ? "text-emerald-600 dark:text-emerald-400"
        : remaining >= 0
          ? "text-amber-600 dark:text-amber-400"
          : "text-red-600 dark:text-red-400";

  return (
    <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">

      {/* ── Top: title, dates, actions ── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        {/* Left: sprint name + meta */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              {sprint.name}
            </h1>
            {/* Status badge */}
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
              Active
            </span>
          </div>

          {/* Date range + days left */}
          <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <CalendarDays size={13} className="shrink-0 text-slate-400" />
              {formatDate(sprint.startDate)} — {formatDate(sprint.endDate)}
            </span>
            <span className={`font-bold ${daysColor}`}>{daysLabel}</span>
          </div>

          {/* Sprint goal */}
          {sprint.goal && (
            <div className="mt-2 flex items-start gap-1.5">
              <Target
                size={13}
                className="mt-0.5 shrink-0 text-indigo-500 dark:text-indigo-400"
              />
              <p className="text-xs text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Goal:
                </span>{" "}
                {sprint.goal}
              </p>
            </div>
          )}
        </div>

        {/* Right: action buttons */}
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Bot size={14} />}
            onClick={onAskAi}
          >
            Ask AI
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Sparkles size={14} />}
            onClick={onSummarize}
          >
            Summarize
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<CheckCheck size={14} />}
            onClick={onCompleteSprint}
            isLoading={isCompleting}
          >
            Complete sprint
          </Button>
        </div>
      </div>

      {/* ── Progress bars ── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Points progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Story Points
            </span>
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
              {stats.donePoints} / {stats.totalPoints} pts
              <span className="ml-1.5 text-indigo-600 dark:text-indigo-400">
                ({pointsPct}%)
              </span>
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-500 dark:bg-indigo-400"
              style={{ width: `${pointsPct}%` }}
            />
          </div>
        </div>

        {/* Tasks progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Tasks
            </span>
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
              {stats.doneTodos} / {stats.totalTodos} done
              <span className="ml-1.5 text-emerald-600 dark:text-emerald-400">
                ({todosPct}%)
              </span>
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500 dark:bg-emerald-400"
              style={{ width: `${todosPct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
