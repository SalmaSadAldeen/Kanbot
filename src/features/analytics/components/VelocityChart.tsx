import type { Sprint } from "../../../types/api";
import { useTranslation } from "../../../store/useAppStore";
import { TrendingUp, Award, Zap, BarChart2, Flame, Layers } from "lucide-react";

interface VelocityChartProps {
  sprints: Sprint[];
}

export function VelocityChart({ sprints }: VelocityChartProps) {
  const { t } = useTranslation();
  const vc = t.projectsPage?.velocityChart;

  const completedSprints = sprints.filter(
    (s) => s.status === "completed" && s.completedStats,
  );

  if (completedSprints.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-2xl transition-all dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-none">
        <div className="flex items-center gap-3.5 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner dark:bg-indigo-950/50 dark:text-indigo-400">
            <TrendingUp size={22} />
          </div>
          <div>
            <h3 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              {vc?.title || "Sprint Velocity Chart"}
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {vc?.subtitle || "Completed story points across finished sprints"}
            </p>
          </div>
        </div>
        <div className="flex h-40 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-400 dark:border-slate-800 dark:bg-slate-800/30">
          <Zap size={24} className="text-indigo-600 animate-pulse" />
          {vc?.noCompletedSprints || "No completed sprints yet for velocity tracking."}
        </div>
      </div>
    );
  }

  const maxPoints = Math.max(
    ...completedSprints.map((s) => s.completedStats?.donePoints ?? 0),
    10,
  );

  const totalDonePoints = completedSprints.reduce(
    (acc, s) => acc + (s.completedStats?.donePoints ?? 0),
    0,
  );

  const avgVelocity = Math.round(totalDonePoints / completedSprints.length);

  const peakVelocity = Math.max(
    ...completedSprints.map((s) => s.completedStats?.donePoints ?? 0),
  );

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-2xl transition-all duration-500 hover:shadow-2xl dark:border-slate-800/80 dark:bg-slate-900/95 dark:shadow-none animate-fadeIn">
      {/* رأس البطاقة */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 dark:bg-indigo-500">
            <TrendingUp size={22} />
          </div>
          <div>
            <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-slate-100">
              {vc?.title || "Sprint Velocity Chart"}
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {vc?.subtitle || "Completed story points across finished sprints"}
            </p>
          </div>
        </div>

        {/* كبسولة متوسط السرعة */}
        <div className="flex items-center gap-2.5 rounded-2xl border border-indigo-100 bg-indigo-50/60 px-4 py-2.5 shadow-xs dark:border-indigo-900/40 dark:bg-indigo-950/30">
          <Award size={18} className="text-indigo-600 dark:text-indigo-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
            {vc?.avgVelocityLabel || "متوسط السرعة"}:
          </span>
          <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
            {avgVelocity} {vc?.pointsLabel || "نقطة"}
          </span>
        </div>
      </div>

      {/* شريط الإحصائيات السريعة */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-800/40">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-400">
            <BarChart2 size={18} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {vc?.totalCompletedLabel || "إجمالي المنجز"}
            </span>
            <p className="text-sm font-black text-slate-800 dark:text-slate-200">
              {totalDonePoints} {vc?.pointsLabel || "نقطة"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/30 p-3.5 shadow-xs dark:border-indigo-900/30 dark:bg-indigo-950/20">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-400">
            <Flame size={18} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {vc?.peakVelocityLabel || "أعلى سرعة ذروة"}
            </span>
            <p className="text-sm font-black text-indigo-700 dark:text-indigo-300">
              {peakVelocity} {vc?.pointsLabel || "نقطة"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-3.5 shadow-xs dark:border-emerald-900/30 dark:bg-emerald-950/20">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
            <Layers size={18} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {vc?.finishedSprintsLabel || "السبرنتات المنتهية"}
            </span>
            <p className="text-sm font-black text-emerald-700 dark:text-emerald-300">
              {completedSprints.length} سبرنتات
            </p>
          </div>
        </div>
      </div>

      {/* منطقة الأعمدة (اللون موحد بدون تدرج، وحواف دائرية خفيفة rounded-md بدلاً من الدائرية الكاملة) */}
      <div className="relative flex h-64 items-end gap-5 pt-8 pb-3 px-4 rounded-2xl bg-slate-50/50 border border-slate-100 dark:bg-slate-800/20 dark:border-slate-800/60">
        {completedSprints.map((sprint) => {
          const donePoints = sprint.completedStats?.donePoints ?? 0;
          const committedPoints = sprint.completedStats?.totalPoints ?? 0;
          const heightPct = Math.round((donePoints / maxPoints) * 100);

          return (
            <div
              key={sprint.id}
              className="group relative flex flex-1 flex-col items-center gap-3 h-full justify-end"
            >
              {/* Tooltip */}
              <div className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 bg-slate-900/95 text-white text-[11px] font-bold rounded-xl px-3.5 py-2 pointer-events-none whitespace-nowrap shadow-2xl backdrop-blur-xl border border-slate-800 z-30 dark:bg-slate-100 dark:text-slate-900">
                <p className="text-indigo-400 dark:text-indigo-600 font-black">
                  {sprint.name}
                </p>
                <p className="text-slate-300 dark:text-slate-600 font-semibold mt-0.5">
                  {vc?.doneLabel || "المنجز"}: {donePoints} / {vc?.committedLabel || "الملتزم به"}: {committedPoints} {vc?.pointsLabel || "نقطة"}
                </p>
              </div>

              {/* رقم النقاط فوق العمود */}
              <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-1">
                {donePoints}
              </span>

              {/* العمود بلون الموقع الثابت (بدون تدرج) وحواف خفيفة rounded-md */}
              <div
                className="w-full max-w-[44px] rounded-md bg-indigo-600 dark:bg-indigo-500 shadow-md transition-all duration-500 ease-out group-hover:scale-105 group-hover:bg-indigo-700 z-10"
                style={{ height: `${Math.max(heightPct, 12)}%` }}
              />

              {/* اسم السبرنت بالأسفل */}
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 truncate max-w-full z-10">
                {sprint.name.replace("Sprint ", "S")}
              </span>
            </div>
          );
        })}

        {/* خط القاعدة السفلي */}
        <div className="absolute bottom-9 left-4 right-4 h-px bg-slate-200 dark:bg-slate-700/60" />
      </div>

      <div className="mt-6 flex items-center justify-center gap-3 text-xs font-bold text-slate-500 dark:text-slate-400">
        <span className="h-3.5 w-3.5 rounded-md bg-indigo-600 dark:bg-indigo-500 shadow-sm" />
        <span>{vc?.legend || "Completed Points (Velocity)"}</span>
      </div>
    </div>
  );
}