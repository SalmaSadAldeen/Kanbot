import { Sparkles, Calendar, CheckCircle2, Play } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import type { Sprint } from "../../../types/api";

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
  allSprints: Sprint[]; // أضفنا قائمة كل السبرنتات لنفحص هل يوجد سبرنت نشط مسبقاً
  sCopy: SprintsCopy;
  onStart: (sprintId: string) => void;
  onOpenCompleteModal: () => void;
  onRegenerateSummary?: () => void;
}

export function SprintDetailsCard({
  currentSprint,
  allSprints,
  sCopy,
  onStart,
  onOpenCompleteModal,
}: SprintDetailsCardProps) {
  if (!currentSprint) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 text-slate-400 text-xs dark:border-slate-800 dark:bg-slate-900">
        {sCopy.selectSprint}
      </div>
    );
  }

  // التحقق هل يوجد سبرنت نشط آخر حالياً في المشروع
  const hasActiveSprint = allSprints.some((s) => s.status === "active");

  const completionPercentage =
    currentSprint.stats.totalTodos > 0
      ? Math.round(
          (currentSprint.stats.doneTodos / currentSprint.stats.totalTodos) *
            100,
        )
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
            <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-bold uppercase text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {currentSprint.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-2">
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

        {/* أزرار الإجراءات */}
        <div className="flex items-center gap-2 shrink-0">
          {/* زر البدء يظهر فقط إذا كان السبرنت مخططاً ولم يكن هناك سبرنت نشط آخر */}
          {currentSprint.status === "planned" && !hasActiveSprint && (
            <Button
              size="sm"
              onClick={() => onStart(currentSprint.id)}
              leftIcon={<Play size={14} className="shrink-0" />}
              className="text-xs font-bold cursor-pointer"
            >
              {sCopy.startSprint}
            </Button>
          )}

          {/* إذا كان هناك سبرنت نشط ومحاولة بدء سبرنت جديد، نظهر ملاحظة أو نخفي الزر */}
          {currentSprint.status === "planned" && hasActiveSprint && (
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1.5 rounded-lg border border-amber-200 dark:border-amber-800">
              Complete active sprint first
            </span>
          )}

          {currentSprint.status === "active" && (
            <Button
              size="sm"
              onClick={onOpenCompleteModal}
              // تمرير الأيقونة حصرياً عبر leftIcon وضبط الكلاسات الأساسية للزر
              leftIcon={<CheckCircle2 size={14} className="shrink-0" />}
              className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
            >
              {sCopy.completeSprint}
            </Button>
          )}
        </div>
      </div>

      {/* بقية الإحصائيات وملخص الـ AI */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {sCopy.completedTodos}
          </span>
          <p className="mt-1 text-xl font-black text-slate-900 dark:text-slate-100">
            {currentSprint.stats.doneTodos} / {currentSprint.stats.totalTodos}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {sCopy.pointsDone}
          </span>
          <p className="mt-1 text-xl font-black text-slate-900 dark:text-slate-100">
            {currentSprint.stats.donePoints} / {currentSprint.stats.totalPoints}
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

      <div className="rounded-2xl border border-slate-200 bg-slate-50/40 p-5 dark:border-slate-800 dark:bg-slate-900/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-indigo-500 shrink-0" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
              {sCopy.aiSummary}
            </h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-[11px] font-semibold gap-1.5 cursor-pointer inline-flex items-center"
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
