import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Calendar, Plus, Layers, AlertCircle } from "lucide-react";
import { useSprints } from "../../hooks/useSprints";
import { Spinner } from "../../components/ui/Spinner";
import { Button } from "../../components/ui/Button";
import { CompleteSprintDialog } from "./components/CompleteSprintDialog";
import { SprintDetailsCard } from "./components/SprintDetailsCard";
import { useTranslation } from "../../store/useAppStore";
import type { CompleteSprintRequest } from "../../types/api";
import { useSprintSummary } from "../../hooks/useAi";
import toast from "react-hot-toast";

export function SprintsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { sprintId } = useParams<{ sprintId?: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const sCopy = t.projectsPage.sprintsPage;
  const summarizeSprint = useSprintSummary();

  const { allSprints, isLoading, error, completeSprint } =
    useSprints(projectId);

  const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  // تحديد السبرنت المختار بدقة، وعدم اختيار سبرنت عشوائي إذا كان الـ ID بالرابط غير صحيح
  const currentSprint =
    allSprints.find((s) => s.id === (selectedSprintId || sprintId)) ??
    (!sprintId && allSprints.length > 0 ? allSprints[0] : null);

  const plannedSprints = allSprints.filter((s) => s.status === "planned");

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size="lg" className="text-indigo-600" />
      </div>
    );
  }

  // حالة الخطأ أو عدم توفر سبرنتات (Empty State موطّنة ومترجمة بالكامل)
  if (error || allSprints.length === 0) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-12">
        <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner dark:bg-indigo-950/60 dark:text-indigo-400 mb-4">
            {error ? <AlertCircle size={32} /> : <Layers size={32} />}
          </div>

          <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">
            {error
              ? (sCopy.loadError ?? "Failed to load sprints")
              : (sCopy.noSprints ?? "No sprints yet")}
          </h2>

          <p className="mt-1.5 max-w-md text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
            {error
              ? (sCopy.loadErrorDesc ??
                "An error occurred while fetching sprints. Please try again or go to backlog.")
              : (sCopy.noSprintsDesc ??
                "You can create and plan new sprints in the Backlog.")}
          </p>

          <Button
            onClick={() => navigate(`/projects/${projectId}/backlog`)}
            className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 cursor-pointer transition-all"
            leftIcon={<Plus size={16} />}
          >
            {sCopy.createInBacklog ?? t.projectsPage.backlogPage.createSprint}
          </Button>
        </div>
      </div>
    );
  }

  const handleCompleteConfirm = async (
    targetSprintId: string | null,
    generateSummary: boolean,
  ) => {
    if (!currentSprint) return;

    const requestData: CompleteSprintRequest = {
      moveUnfinishedTo: targetSprintId === null ? "backlog" : targetSprintId,
    };

    await completeSprint.mutateAsync({
      sprintId: currentSprint.id,
      data: requestData,
    });
    setIsCompleteModalOpen(false);

    if (generateSummary) {
      try {
        await summarizeSprint.mutateAsync(currentSprint.id);
        toast.success(t.ai.summaryReady);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : t.ai.summaryFailed);
      }
    }
    navigate(`/projects/${projectId}/sprints/${currentSprint.id}`);
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 pb-12 px-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <h1 className="text-lg font-black text-slate-900 dark:text-slate-100">
            {sCopy.title}
          </h1>
          <p className="text-xs text-slate-500">
            {allSprints.length} {sCopy.totalSprints}
          </p>
        </div>
        <Button
          onClick={() => navigate(`/projects/${projectId}/backlog`)}
          variant="outline"
          size="sm"
          className="rounded-xl border-slate-200 bg-slate-50/50 text-xs font-bold text-indigo-600 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800/50 dark:text-indigo-400 cursor-pointer"
          leftIcon={<Plus size={14} />}
        >
          {sCopy.createInBacklog ?? t.projectsPage.backlogPage.createSprint}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* قائمة السبرنتات الجانبية */}
        <div className="space-y-3 lg:col-span-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {sCopy.allSprints}
          </h3>
          <div className="space-y-2.5">
            {allSprints.map((sprint) => {
              const isSelected = currentSprint?.id === sprint.id;
              return (
                <div
                  key={sprint.id}
                  onClick={() => {
                    setSelectedSprintId(sprint.id);
                    navigate(`/projects/${projectId}/sprints/${sprint.id}`);
                  }}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/20 shadow-md dark:border-indigo-500 dark:bg-indigo-950/20"
                      : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {sprint.name}
                    </h4>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                        sprint.status === "active"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                          : sprint.status === "completed"
                            ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                      }`}
                    >
                      {sprint.status}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                    <span className="flex min-w-0 items-center gap-1">
                      <Calendar size={12} className="shrink-0" />{" "}
                      {sprint.startDate ?? "No start"} –{" "}
                      {sprint.endDate ?? "No end"}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {sprint.stats.donePoints} / {sprint.stats.totalPoints} pts
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* عرض تفاصيل السبرنت عبر المكون المستقل */}
        <div className="lg:col-span-7">
          <SprintDetailsCard
            currentSprint={currentSprint}
            sCopy={sCopy}
            allSprints={allSprints}
            onOpenCompleteModal={() => setIsCompleteModalOpen(true)}
          />
        </div>
      </div>

      {/* نافذة إكمال السبرنت */}
      <CompleteSprintDialog
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        activeSprint={currentSprint}
        plannedSprints={plannedSprints}
        onConfirm={handleCompleteConfirm}
        isPending={completeSprint.isPending}
      />
    </div>
  );
}
