import { differenceInCalendarDays, parseISO } from "date-fns";
import {
  CalendarRange,
  Target,
  Sparkles,
  CheckCircle2,
  Clock,
  Zap,
} from "lucide-react";
import { Button } from "../../../components/ui/Button";
import type { Sprint } from "../../../types/api";
import { useTranslation } from "../../../store/useAppStore";

const ICON_SIZE = 14;
const ICON_STROKE = 2;

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
    return new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(parseISO(dateStr));
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
      <div className={`relative h-1.5 w-full overflow-hidden rounded-full ${trackClass}`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
      <div
        className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out ${colorClass}`}
        style={{ width: `${pct}%`, insetInlineStart: 0 }}
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
function StatChip({ label, value, pct, icon, barColor, barTrack, pctColor }: StatChipProps) {
  return (
    <div className="flex min-w-[160px] flex-1 flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {icon}
          {label}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
            {value}
          </span>
          <span className={`text-[11px] font-bold tabular-nums ${pctColor}`}>
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

  // حساب المهام غير المنتهية (التلسين أو الترحيل للباكلوج)
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
      ? "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
      : remaining > 3
        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
        : remaining >= 0
          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
          : "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-400";

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

      {/* Thin accent bar — Jira style */}
      <div className="h-[3px] w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400" />

      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          {/* Left block */}
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-slate-50 sm:text-xl">
                {sprint.name}
              </h1>

              <span className="inline-flex h-5 items-center gap-1 rounded-full bg-emerald-100 pl-1.5 pr-2.5 text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                {bd.active}
              </span>

              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${daysChipClass}`}
              >
                <Clock size={10} strokeWidth={2.5} />
                {daysLabel}
              </span>

              {/* تنبيه إذا كان هناك مهام غير منتهية */}
              {unfinishedTodos > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60">
                  ⚠️ {bd.unfinishedWarning.replace("{n}", String(unfinishedTodos))}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <CalendarRange size={ICON_SIZE} strokeWidth={ICON_STROKE} aria-hidden="true" className="shrink-0 text-slate-400" />
              <span>
                {formatDate(sprint.startDate, lang)}&nbsp;&mdash;&nbsp;{formatDate(sprint.endDate, lang)}
              </span>
            </div>

            {sprint.goal && (
              <div className="flex items-start gap-1.5 pt-0.5">
                <Target
                  size={13}
                  className="mt-0.5 shrink-0 text-indigo-500 dark:text-indigo-400"
                />
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  <span className="font-semibold">{bd.sprintGoalLabel}:</span>{" "}
                  {sprint.goal}
                </p>
              </div>
            )}
          </div>

          {/* Right: action buttons */}
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Sparkles size={13} />}
              onClick={onSummarize}
              className="h-8 rounded-lg text-xs font-semibold cursor-pointer"
            >
              {bd.summarize}
            </Button>

            {/* زر إنهاء السبرنت المرتبط مباشرة بالهوك */}
            <Button
              variant="primary"
              size="sm"
              leftIcon={<CheckCircle2 size={13} className="shrink-0" />}
              onClick={onCompleteSprint}
              isLoading={isCompleting}
              className="h-8 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-sm"
            >
              {bd.completeSprint}
            </Button>
          </div>
        </div>

        {/* Progress stats */}
        <div className="mt-5 flex flex-wrap gap-4 border-t border-slate-100 pt-5 dark:border-slate-800">
          <StatChip
            label={bd.storyPointsLabel}
            value={`${stats.donePoints} / ${stats.totalPoints} ${bd.pts}`}
            pct={pointsPct}
            icon={<Zap size={11} strokeWidth={2.5} className="text-indigo-500" />}
            barColor="bg-indigo-500 dark:bg-indigo-400"
            barTrack="bg-indigo-100 dark:bg-indigo-950/40"
            pctColor="text-indigo-600 dark:text-indigo-400"
          />

          <div className="hidden w-px self-stretch bg-slate-200 dark:bg-slate-800 sm:block" />

          <StatChip
            label={bd.tasksLabel}
            value={`${stats.doneTodos} / ${stats.totalTodos} ${bd.done}`}
            pct={todosPct}
            icon={<CheckCircle2 size={11} strokeWidth={2.5} className="text-emerald-500" />}
            barColor="bg-emerald-500 dark:bg-emerald-400"
            barTrack="bg-emerald-100 dark:bg-emerald-950/40"
            pctColor="text-emerald-600 dark:text-emerald-400"
          />
        </div>
      </div>
    </div>
  );
}
