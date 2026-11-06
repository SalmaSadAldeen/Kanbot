import { Sparkles, Calendar, CheckCircle2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import type { Sprint } from "../../../types/api";
import { useAiUi } from "../../../store/useAiUi";

interface SprintsCopy {
  selectSprint: string;
  noGoal: string;
  startSprint: string;
  completeSprint: string;
  completedTodos: string;
  pointsDone: string;
  carriedOver: string;
  completion: string;
  aiSummary: string;
  regenerate: string;
  noSummary: string;
}

interface SprintDetailsCardProps {
  currentSprint: Sprint | null;
  allSprints: Sprint[];
  sCopy: SprintsCopy;
  onStart?: (sprintId: string) => void;
  onOpenCompleteModal: () => void;
  onRegenerateSummary?: () => void;
}

export function SprintDetailsCard({
  currentSprint,
  sCopy,
  onOpenCompleteModal,
}: SprintDetailsCardProps) {
  const openSummary = useAiUi((s) => s.openSummary);

  if (!currentSprint) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 mb-3">
          <Calendar size={22} />
        </div>
        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
          {sCopy.selectSprint}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          اختر سبرنتاً من القائمة لعرض تفاصيله وإحصائياته.
        </p>
      </div>
    );
  }

  // حساب نسبة الإكمال (إما من completedStats إن وجدت أو من الإحصائيات الحالية)
  const stats = currentSprint.completedStats ?? currentSprint.stats;
  const completionPercentage =
    stats.totalTodos > 0
      ? Math.round((stats.doneTodos / stats.totalTodos) * 100)
      : 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
      {/* رأس السبرنت */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
              {currentSprint.name}
            </h2>
            <span
              className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-[11px] font-bold uppercase ${
                currentSprint.status === "active"
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                  : currentSprint.status === "completed"
                    ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                    : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
              }`}
            >
              {currentSprint.status}
            </span>
          </div>
          <p className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <Calendar size={13} className="text-slate-400 shrink-0" />
            <span>
              {currentSprint.startDate ?? "No start"} –{" "}
              {currentSprint.endDate ?? "No end"}
            </span>
            <span>·</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Goal: {currentSprint.goal || sCopy.noGoal}
            </span>
          </p>
        </div>

        {/* زر إكمال السبرنت يظهر فقط إذا كان السبرنت نشطاً */}
        <div className="flex items-center gap-2 shrink-0">
          {currentSprint.status === "active" && (
            <Button
              size="sm"
              onClick={onOpenCompleteModal}
              leftIcon={<CheckCircle2 size={14} className="shrink-0" />}
              className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer rounded-xl px-4"
            >
              {sCopy.completeSprint}
            </Button>
          )}
        </div>
      </div>

      {/* بطاقات الإحصائيات الأربعة */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {sCopy.completedTodos}
          </span>
          <p className="mt-1 text-xl font-black text-slate-900 dark:text-slate-100">
            {stats.doneTodos} / {stats.totalTodos}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {sCopy.pointsDone}
          </span>
          <p className="mt-1 text-xl font-black text-slate-900 dark:text-slate-100">
            {stats.donePoints} / {stats.totalPoints}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {sCopy.carriedOver}
          </span>
          <p className="mt-1 text-xl font-black text-slate-900 dark:text-slate-100">
            {currentSprint.completedStats?.carriedOver ?? 0}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {sCopy.completion}
          </span>
          <p className="mt-1 text-xl font-black text-indigo-600 dark:text-indigo-400">
            {completionPercentage}%
          </p>
        </div>
      </div>

      {/* ملخص الذكاء الاصطناعي */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/40 p-5 dark:border-slate-800 dark:bg-slate-900/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-indigo-500 shrink-0" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
              {sCopy.aiSummary}
            </h3>
          </div>
          <Button
            onClick={() => openSummary(currentSprint.id)}
            variant="outline"
            size="sm"
            className="h-8 text-[11px] font-semibold gap-1.5 cursor-pointer inline-flex items-center rounded-xl"
          >
            <Sparkles size={12} className="shrink-0" />
            <span>{sCopy.regenerate}</span>
          </Button>
        </div>

        <div className="text-xs text-slate-700 dark:text-slate-300 space-y-2 leading-relaxed">
          {currentSprint.summary ? (
            <div className="whitespace-pre-line">
              {currentSprint.summary.content}
            </div>
          ) : (
            <p className="text-slate-400 italic">{sCopy.noSummary}</p>
          )}
        </div>

        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400">
          {currentSprint.updatedAt
            ? `Generated ${new Date(currentSprint.updatedAt).toLocaleDateString()}`
            : ""}{" "}
          · AI can make mistakes.
        </div>
      </div>
    </div>
  );
}
