import { useState } from "react";
import { useParams } from "react-router";
import { Plus } from "lucide-react";
import { Dialog } from "../../../components/ui/Dialog";
import { Button } from "../../../components/ui/Button";
import { useGenerateTodos, useSaveDraftTodos } from "../../../hooks/useAi";
import { useTranslation } from "../../../store/useAppStore";
import { useAiUi } from "../../../store/useAiUi";
import { AiStateBlock } from "./AiStateBlock";
import type { DraftTodo } from "../../../types/api";

export function GenerateTodosDialog() {
  const { projectId = "" } = useParams();
  const { t } = useTranslation();
  const c = t.ai;
  const open = useAiUi((s) => s.dialog === "generate");
  const close = useAiUi((s) => s.closeDialog);
  const gen = useGenerateTodos(projectId);
  const save = useSaveDraftTodos(projectId);

  const [prompt, setPrompt] = useState("");
  const [count, setCount] = useState(5);
  const [drafts, setDrafts] = useState<DraftTodo[]>([]);
  const [selected, setSelected] = useState<boolean[]>([]);

  const generate = () => {
    if (prompt.trim().length < 3 || gen.isPending) return;
    gen.mutate(
      { prompt, count },
      {
        onSuccess: (r) => {
          setDrafts(r.todos);
          setSelected(r.todos.map(() => true));
        },
      },
    );
  };

  const update = (i: number, v: Partial<DraftTodo>) =>
    setDrafts((d) => d.map((x, n) => (n === i ? { ...x, ...v } : x)));

  const add = () => {
    const chosen = drafts.filter((_, i) => selected[i]);
    if (!chosen.length || save.isPending) return;
    save.mutate(chosen, {
      onSuccess: () => {
        close();
        setDrafts([]);
        setPrompt("");
      },
    });
  };

  const selectedCount = selected.filter(Boolean).length;

  return (
    <Dialog isOpen={open} onClose={close} title={c.generateTitle} maxWidth="xl">
      <div className="space-y-5 py-1">
        {/* صندوق إدخال الوصف والعدد */}
        <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/30">
          <label className="block space-y-1.5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {c.describeFeature}
            </span>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  generate();
                }
              }}
              minLength={3}
              maxLength={2000}
              rows={3}
              placeholder="e.g., User authentication with OAuth and password reset flow..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-xs font-medium text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 transition-all shadow-2xs"
            />
          </label>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {c.count}
              </span>
              <input
                type="number"
                min={1}
                max={10}
                value={count}
                onChange={(e) =>
                  setCount(Math.max(1, Math.min(10, Number(e.target.value))))
                }
                className="w-16 rounded-xl border border-slate-200 bg-white p-2 text-center text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 transition-all shadow-2xs"
              />
            </label>

            {/* زر توليد مرتب ورايق بدون أيقونات مزحمة */}
            <Button
              onClick={generate}
              disabled={prompt.trim().length < 3 || gen.isPending}
              isLoading={gen.isPending}
              size="sm"
              className="rounded-xl px-5 py-2 bg-indigo-600 text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all cursor-pointer font-semibold"
            >
              <span>{c.generate}</span>
            </Button>
          </div>

          {/* كتلة الخطأ والتحميل الخاصة بالتوليد مباشرة تحت الأزرار */}
          <AiStateBlock error={gen.error} onRetry={generate} />
        </div>

        {/* قائمة المسودات المولدة */}
        {drafts.length > 0 && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold text-slate-600 dark:text-slate-400">
                Generated Drafts ({drafts.length})
              </h3>
              <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                {selectedCount} selected
              </span>
            </div>

            <div className="max-h-[320px] space-y-2.5 overflow-y-auto pr-1 custom-scrollbar">
              {drafts.map((d, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3 shadow-2xs dark:border-slate-800 dark:bg-slate-900 transition-all"
                >
                  <input
                    type="checkbox"
                    checked={!!selected[i]}
                    onChange={(e) =>
                      setSelected((s) =>
                        s.map((v, n) => (n === i ? e.target.checked : v)),
                      )
                    }
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
                  />

                  <div className="grid flex-1 gap-2.5 sm:grid-cols-4">
                    <input
                      aria-label={c.titleLabel}
                      value={d.title}
                      onChange={(e) => update(i, { title: e.target.value })}
                      className="rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-100 transition-all sm:col-span-1"
                    />

                    <select
                      aria-label={c.type}
                      value={d.type}
                      onChange={(e) =>
                        update(i, { type: e.target.value as DraftTodo["type"] })
                      }
                      className="rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-200 transition-all"
                    >
                      {(["task", "story", "bug"] as const).map((x) => (
                        <option key={x} value={x}>
                          {c[x]}
                        </option>
                      ))}
                    </select>

                    <select
                      aria-label={c.priority}
                      value={d.priority}
                      onChange={(e) =>
                        update(i, {
                          priority: e.target.value as DraftTodo["priority"],
                        })
                      }
                      className="rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-200 transition-all"
                    >
                      {(["low", "medium", "high", "urgent"] as const).map(
                        (x) => (
                          <option key={x} value={x}>
                            {c[x]}
                          </option>
                        ),
                      )}
                    </select>

                    <select
                      aria-label={c.points}
                      value={d.storyPoints ?? ""}
                      onChange={(e) =>
                        update(i, {
                          storyPoints: e.target.value
                            ? (Number(
                                e.target.value,
                              ) as DraftTodo["storyPoints"])
                            : null,
                        })
                      }
                      className="rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-200 transition-all"
                    >
                      <option value="">{c.none}</option>
                      {[1, 2, 3, 5, 8, 13].map((x) => (
                        <option key={x} value={x}>
                          {x} pts
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* خطأ الحفظ (Save Error Block) */}
        <AiStateBlock error={save.error} />

        {/* زر الإضافة للباكلوغ */}
        {drafts.length > 0 && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <Button
              onClick={add}
              isLoading={save.isPending}
              disabled={save.isPending || !selected.some(Boolean)}
              className="gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-all cursor-pointer font-semibold"
            >
              <Plus size={16} />
              <span>
                {c.addToBacklog.replace("{n}", String(selectedCount))}
              </span>
            </Button>
          </div>
        )}
      </div>
    </Dialog>
  );
}
