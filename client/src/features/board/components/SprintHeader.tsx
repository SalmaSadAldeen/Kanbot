import { differenceInCalendarDays, parseISO } from "date-fns";
import {
  CalendarRange,
  Target,
  Sparkles,
  CheckCircle2,
  Clock,
  Zap,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../../../components/ui/Button";
import type { Sprint } from "../../../types/api";
import { useTranslation } from "../../../store/useAppStore";

const ICON_SIZE = 15;
const ICON_STROKE = 2.2;

interface SprintHeaderProps {
  sprint: Sprint;
  onCompleteSprint: () => void;
  onSummarize: () => void;
  isCompleting?: boolean;
}

/** "Nov 3, 2026" */
function formatDate(dateStr: string | null, locale: string): string {
  if (!dateStr) return "—";
  try {
    return new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }).format(parseISO(dateStr));
  } catch {
    return dateStr;
  }
}

function daysRemaining(endDate: string | null): number | null {
  if (!endDate) return null;
  try {
    return differenceInCalendarDays(parseISO(endDate), new Date());
  } catch {
    return null;
  }
}

// ── Smooth animated progress bar ───────────────────────────────────────────
interface ProgressBarProps {
  value: number; // 0-100
  colorClass: string;
  trackClass: string;
}
function ProgressBar({ value, colorClass, trackClass }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div
      className={`relative h-2 w-full overflow-hidden rounded-full ${trackClass} shadow-inner`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
    >
      <div
        className={`absolute inset-y-0 start-0 rounded-full transition-all duration-1000 ease-out ${colorClass}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ── Stat chip ───────────────────────────────────────────────────────────────
interface StatChipProps {
  label: string;
  value: string;
  pct: number;
  icon: React.ReactNode;
  barColor: string;
  barTrack: string;
  pctColor: string;
}
function StatChip({
  label,
  value,
  pct,
  icon,
  barColor,
  barTrack,
  pctColor,
}: StatChipProps) {
  return (
    <div className="flex min-w-[180px] flex-1 flex-col gap-2 transition-transform duration-300 hover:scale-[1.01]">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {icon}
          {label}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-black text-slate-800 dark:text-slate-100">
            {value}
          </span>
          <span className={`text-xs font-black tabular-nums ${pctColor}`}>
            {pct}%
          </span>
        </div>
      </div>
      <ProgressBar value={pct} colorClass={barColor} trackClass={barTrack} />
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export function SprintHeader({
  sprint,
  onCompleteSprint,
  onSummarize,
  isCompleting = false,
}: SprintHeaderProps) {
  const { t, lang } = useTranslation();
  const bd = t.projectsPage.boardPage;

  const stats = sprint.stats;

  const pointsPct =
    stats.totalPoints > 0
      ? Math.round((stats.donePoints / stats.totalPoints) * 100)
      : 0;
  const todosPct =
    stats.totalTodos > 0
      ? Math.round((stats.doneTodos / stats.totalTodos) * 100)
      : 0;

  const unfinishedTodos = stats.totalTodos - stats.doneTodos;
  const remaining = daysRemaining(sprint.endDate);

  const daysLabel =
    remaining === null
      ? bd.noEndDate
      : remaining > 0
        ? `${remaining} ${bd.daysLeft}`
        : remaining === 0
          ? bd.dueToday
          : `${Math.abs(remaining)} ${bd.daysOverdue}`;

  const daysChipClass =
    remaining === null
      ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
      : remaining > 3
        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/50"
        : remaining >= 0
          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200/50"
          : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200/50";

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md transition-all duration-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      {/* خط علوي حيوي بلون أزرق نقي (بدون أي موف) */}
      <div className="h-[3px] w-full bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600" />

      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          {/* Left block */}
          <div className="min-w-0 space-y-2.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-50 sm:text-2xl">
                {sprint.name}
              </h1>

              <span className="inline-flex h-6 items-center gap-1.5 rounded-full bg-emerald-100 px-3 text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 shadow-2xs">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                {bd.active}
              </span>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-[11px] font-bold shadow-2xs ${daysChipClass}`}
              >
                <Clock size={ICON_SIZE} strokeWidth={ICON_STROKE} />
                {daysLabel}
              </span>

              {unfinishedTodos > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-0.5 text-[11px] font-bold text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60">
                  <AlertTriangle
                    size={14}
                    strokeWidth={2.2}
                    className="shrink-0 text-amber-600 dark:text-amber-400"
                  />
                  {bd.unfinishedWarning.replace("{n}", String(unfinishedTodos))}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <CalendarRange
                size={ICON_SIZE}
                strokeWidth={ICON_STROKE}
                aria-hidden="true"
                className="shrink-0 text-blue-500"
              />
              <span>
                {formatDate(sprint.startDate, lang)}&nbsp;&mdash;&nbsp;
                {formatDate(sprint.endDate, lang)}
              </span>
            </div>

            {sprint.goal && (
              <div className="flex items-start gap-2 pt-1">
                <Target
                  size={ICON_SIZE}
                  strokeWidth={ICON_STROKE}
                  className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
                />
                <p className="text-xs font-medium leading-relaxed text-slate-600 dark:text-slate-300">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {bd.sprintGoalLabel}:
                  </span>{" "}
                  {sprint.goal}
                </p>
              </div>
            )}
          </div>

          {/* Right: action buttons مع تأثير حركي خفيف عند التمرير */}
          <div className="flex shrink-0 flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              leftIcon={
                <Sparkles
                  size={14}
                  strokeWidth={2.2}
                  className="text-blue-500"
                />
              }
              onClick={onSummarize}
              className="h-9 rounded-xl text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-2xs hover:border-blue-300"
            >
              {bd.summarize}
            </Button>

            <Button
              variant="primary"
              size="sm"
              leftIcon={
                <CheckCircle2
                  size={14}
                  strokeWidth={2.2}
                  className="shrink-0"
                />
              }
              onClick={onCompleteSprint}
              isLoading={isCompleting}
              className="h-9 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-md shadow-emerald-600/20"
            >
              {bd.completeSprint}
            </Button>
          </div>
        </div>

        {/* Progress stats */}
        <div className="mt-6 flex flex-wrap gap-6 border-t border-slate-100 pt-5 dark:border-slate-800">
          <StatChip
            label={bd.storyPointsLabel}
            value={`${stats.donePoints} / ${stats.totalPoints} ${bd.pts}`}
            pct={pointsPct}
            icon={<Zap size={14} strokeWidth={2.5} className="text-blue-500" />}
            barColor="bg-gradient-to-r from-blue-600 to-sky-500"
            barTrack="bg-blue-100 dark:bg-blue-950/50"
            pctColor="text-blue-600 dark:text-blue-400"
          />

          <div className="hidden w-px self-stretch bg-slate-200 dark:bg-slate-800 sm:block" />

          <StatChip
            label={bd.tasksLabel}
            value={`${stats.doneTodos} / ${stats.totalTodos} ${bd.done}`}
            pct={todosPct}
            icon={
              <CheckCircle2
                size={14}
                strokeWidth={2.5}
                className="text-emerald-500"
              />
            }
            barColor="bg-gradient-to-r from-emerald-500 to-teal-500"
            barTrack="bg-emerald-100 dark:bg-emerald-950/50"
            pctColor="text-emerald-600 dark:text-emerald-400"
          />
        </div>
      </div>
    </div>
  );
}
