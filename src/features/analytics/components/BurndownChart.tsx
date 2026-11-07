import type { Sprint } from "../../../types/api";
import { useTranslation } from "../../../store/useAppStore";
import { Target, CheckCircle2, Clock, Flame } from "lucide-react";

interface BurndownChartProps {
  activeSprint: Sprint | null;
}

export function BurndownChart({ activeSprint }: BurndownChartProps) {
  const { t } = useTranslation();
  const sa = t.projectsPage?.sprintAnalytics;

  const stats = activeSprint?.stats;
  const totalTasks = stats?.totalTodos ?? 0;
  const completedTasks = stats?.doneTodos ?? 0;
  const remainingTasks = Math.max(0, totalTasks - completedTasks);
  const completionPct =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-2xl transition-all duration-500 hover:shadow-2xl dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-none animate-fadeIn">
      {/* رأس البطاقة */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
            <Target size={22} />
          </div>
          <div>
            <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-slate-100">
              {sa?.burndownTitle || "Sprint Burndown Progress"}
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {activeSprint
                ? `${activeSprint.name} — ${sa?.burndownSubtitle || "Remaining tasks overview"}`
                : sa?.noActiveSprint || "No active sprint"}
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-2 text-xs font-black text-emerald-700 border border-emerald-100 shadow-xs dark:border-emerald-900/40 dark:from-emerald-950/40 dark:to-teal-950/40 dark:text-emerald-300">
          <Flame size={16} className="animate-bounce text-emerald-500" />
          {completionPct}% {sa?.donePercent || "Done"}
        </span>
      </div>

      {activeSprint && activeSprint.status === "active" ? (
        <div className="space-y-6">
          {/* الكروت الإحصائية العلوية بتصميم غني وعميق */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5 shadow-xs transition-all hover:scale-[1.02] dark:border-slate-800 dark:bg-slate-800/40">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {sa?.totalTasksLabel || "إجمالي المهام"}
              </span>
              <p className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1.5">
                {totalTasks}
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-100/80 bg-gradient-to-br from-emerald-50/60 to-teal-50/40 p-5 shadow-xs transition-all hover:scale-[1.02] dark:border-emerald-900/40 dark:from-emerald-950/20 dark:to-teal-950/10">
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                {sa?.completedTasksLabel || "المكتملة"}
              </span>
              <p className="text-3xl font-black text-emerald-700 dark:text-emerald-300 mt-1.5">
                {completedTasks}
              </p>
            </div>
            <div className="rounded-2xl border border-amber-100/80 bg-gradient-to-br from-amber-50/60 to-orange-50/40 p-5 shadow-xs transition-all hover:scale-[1.02] dark:border-amber-900/40 dark:from-amber-950/20 dark:to-orange-950/10">
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                {sa?.remainingTasksLabel || "المتبقية"}
              </span>
              <p className="text-3xl font-black text-amber-700 dark:text-amber-300 mt-1.5">
                {remainingTasks}
              </p>
            </div>
          </div>

          {/* شريط التقدم الفخم بانيميشن التعبئة */}
          <div className="space-y-2.5">
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>{sa?.progressLabel || "معدل إنجاز المهام الحالية"}</span>
              <span className="text-emerald-600 dark:text-emerald-400">
                {completionPct}%
              </span>
            </div>
            <div className="relative h-4 w-full overflow-hidden rounded-2xl bg-slate-100 p-0.5 shadow-inner dark:bg-slate-800">
              <div
                className="absolute inset-y-0 start-0 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 transition-all duration-1000 ease-out shadow-md shadow-emerald-500/30"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>

          {/* كروت الحالة السفلية */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/30">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
                <Clock size={20} />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {sa?.targetPace || "Target Pace"}
                </span>
                <p className="text-sm font-black text-slate-800 dark:text-slate-200 mt-0.5">
                  {sa?.steadyBurn || "Steady Burn"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/30">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {sa?.currentStatus || "Current Status"}
                </span>
                <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {remainingTasks === 0
                    ? sa?.allDone || "All Tasks Done"
                    : `${remainingTasks} ${sa?.tasksLeftSuffix || "مهام متبقية للإنجاز"}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-40 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-400 dark:border-slate-800 dark:bg-slate-800/30">
          <Target size={24} className="text-emerald-500 animate-spin" />
          {sa?.noActiveSprintTracker ||
            "No active sprint found for burndown tracking."}
        </div>
      )}
    </div>
  );
}
