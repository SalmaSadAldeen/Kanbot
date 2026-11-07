import { useState } from "react";
import { useParams } from "react-router";
import {  Calendar, Target, Layers } from "lucide-react";
import { Dialog } from "../../../components/ui/Dialog";
import { Button } from "../../../components/ui/Button";
import { usePlanSprint } from "../../../hooks/useAi";
import { useSprints } from "../../../hooks/useSprints";
import { useBacklogMaster } from "../../../hooks/useBacklogMaster";
import { useTranslation } from "../../../store/useAppStore";
import { useAiUi } from "../../../store/useAiUi";
import { AiStateBlock } from "./AiStateBlock";

export function PlanSprintDialog() {
  const { projectId = "" } = useParams();
  const { t } = useTranslation();
  const c = t.ai;
  const open = useAiUi((s) => s.dialog === "plan");
  const close = useAiUi((s) => s.closeDialog);
  const plan = usePlanSprint(projectId);
  const { createSprint } = useSprints(projectId);
  const { rawBacklogTodos } = useBacklogMaster(projectId);

  const [capacity, setCapacity] = useState(20);
  const [focus, setFocus] = useState("");
  const [result, setResult] = useState<Awaited<
    ReturnType<typeof plan.mutateAsync>
  > | null>(null);
  const [goal, setGoal] = useState("");
  const [checked, setChecked] = useState<string[]>([]);

  const suggest = () =>
    plan.mutate(
      { capacity, focus },
      {
        onSuccess: (r) => {
          setResult(r);
          setGoal(r.goal);
          setChecked(r.todoIds);
        },
      },
    );

  const create = () =>
    createSprint.mutate({ goal, todoIds: checked }, { onSuccess: close });

  const chosen = rawBacklogTodos.filter((x) => checked.includes(x.id));
  const points = chosen.reduce((n, x) => n + (x.storyPoints ?? 0), 0);

  return (
    <Dialog isOpen={open} onClose={close} title={c.planTitle} maxWidth="lg">
      <div className="space-y-5 py-1">
        {/* حقول الإدخال الأساسية */}
        <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block space-y-1.5">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {c.capacity} (Points)
              </span>
              <input
                type="number"
                min={1}
                max={200}
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 transition-all shadow-2xs"
              />
            </label>

            <label className="block space-y-1.5 sm:col-span-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {c.focus} (Optional)
              </span>
              <input
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
                maxLength={300}
                placeholder="e.g. Focus on user onboarding and performance optimizations..."
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-medium text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 transition-all shadow-2xs"
              />
            </label>
          </div>

          <div className="flex justify-end pt-1">
            <Button
              onClick={suggest}
              disabled={capacity < 1 || capacity > 200 || plan.isPending}
              isLoading={plan.isPending}
              size="sm"
              className="gap-1.5 rounded-xl shadow-md shadow-indigo-600/20"
            >
              <span>{c.suggest}</span>
            </Button>
          </div>
        </div>

        <AiStateBlock
          loading={plan.isPending}
          error={plan.error}
          onRetry={suggest}
        />

        {/* نتائج الاقتراح */}
        {result && (
          <div className="space-y-4 rounded-2xl border border-indigo-100 bg-indigo-50/30 p-4 dark:border-indigo-950 dark:bg-indigo-950/10 animate-in fade-in duration-200">
            <label className="block space-y-1.5">
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                <Target
                  size={14}
                  className="text-indigo-600 dark:text-indigo-400"
                />
                {c.goal}
              </span>
              <input
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 transition-all shadow-2xs"
              />
            </label>

            {/* مؤشر السعة والنقاط */}
            <div className="flex items-center justify-between text-xs font-bold">
              <span
                className={
                  points > capacity
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-slate-700 dark:text-slate-300"
                }
              >
                {c.total}: {points} / {capacity} {c.points}
                {points > capacity && (
                  <span className="ms-2 font-normal text-rose-500">
                    ({c.overCapacity})
                  </span>
                )}
              </span>
              <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                {checked.length} tasks selected
              </span>
            </div>

            {/* التعليل (Reasoning) */}
            <div className="rounded-xl border border-indigo-200/60 bg-white/80 p-3 text-xs font-medium text-slate-600 dark:border-indigo-900/50 dark:bg-slate-900/80 dark:text-slate-300 shadow-2xs leading-relaxed">
              {result.reasoning}
            </div>

            {/* قائمة المهام المقترحة */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Layers size={14} className="text-slate-400" />
                Suggested Backlog Tasks
              </h4>
              <div className="max-h-52 space-y-2 overflow-y-auto pr-1 custom-scrollbar">
                {rawBacklogTodos
                  .filter((x) => result.todoIds.includes(x.id))
                  .map((todo) => (
                    <label
                      key={todo.id}
                      className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3 text-xs shadow-2xs dark:border-slate-800 dark:bg-slate-900 cursor-pointer hover:border-indigo-300 transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={checked.includes(todo.id)}
                        onChange={(e) =>
                          setChecked((v) =>
                            e.target.checked
                              ? [...v, todo.id]
                              : v.filter((id) => id !== todo.id),
                          )
                        }
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
                      />
                      <span className="font-medium text-slate-800 dark:text-slate-200 flex-1">
                        <bdi
                          dir="ltr"
                          className="font-bold text-indigo-600 dark:text-indigo-400 me-1"
                        >
                          {todo.key}
                        </bdi>{" "}
                        {todo.title} ·{" "}
                        <span className="font-semibold text-slate-500">
                          {todo.storyPoints ?? 0} {c.points}
                        </span>
                      </span>
                    </label>
                  ))}
              </div>
            </div>

            <div className="pt-2 border-t border-indigo-100 dark:border-indigo-950 flex justify-end">
              <Button
                onClick={create}
                disabled={createSprint.isPending || !goal.trim()}
                isLoading={createSprint.isPending}
                leftIcon={<Calendar size={16} />}
                className="gap-2 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-all"
              >
                <span>
                  {c.createWithTodos.replace("{n}", String(checked.length))}
                </span>
              </Button>
            </div>

            <AiStateBlock error={createSprint.error} />
          </div>
        )}
      </div>
    </Dialog>
  );
}
