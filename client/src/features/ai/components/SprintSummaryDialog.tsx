import { useQuery } from "@tanstack/react-query";
import { Sparkles, FileText } from "lucide-react";
import { useAiUi } from "../../../store/useAiUi";
import { useSprintSummary } from "../../../hooks/useAi";
import { getSprint } from "../../../api/sprints";
import { Dialog } from "../../../components/ui/Dialog";
import { Button } from "../../../components/ui/Button";
import { useTranslation } from "../../../store/useAppStore";
import { AiStateBlock } from "./AiStateBlock";
import ReactMarkdown from "react-markdown";

export function SprintSummaryDialog() {
  const { t, lang } = useTranslation();
  const c = t.ai;
  const id = useAiUi((s) => s.summarySprintId);
  const close = useAiUi((s) => s.closeSummary);

  const query = useQuery({
    queryKey: ["sprints", id],
    queryFn: () => getSprint(id!),
    enabled: !!id,
  });

  const summaryMutation = useSprintSummary();
  const {
    mutate,
    isPending,
    error: summaryError,
    data: mutationData,
  } = summaryMutation;

  // إعطاء الأولوية للبيانات الناتجة فوراً من التوليد، ثم البيانات المحفوظة بالسبرينت
  const activeSummary = mutationData?.sprint.summary ?? query.data?.summary;

  const generate = () => {
    if (!id || isPending) return;
    mutate(id);
  };

  return (
    <Dialog
      isOpen={!!id}
      onClose={() => {
        if (!isPending) close();
      }}
      title={c.summaryTitle}
      maxWidth="lg"
      disableCloseWhilePending={isPending}
    >
      <div className="space-y-6 py-2">
        {/* حالة جلب بيانات السبرنت لأول مرة */}
        {query.isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            <span className="text-xs font-semibold text-slate-400">
              Loading summary...
            </span>
          </div>
        ) : query.error ? (
          <AiStateBlock
            error={query.error}
            onRetry={() => void query.refetch()}
          />
        ) : activeSummary ? (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* محتوى التلخيص بصيغة Markdown ضمن حاوية فخمة ومرتبة */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 dark:border-slate-800 dark:bg-slate-800/40 shadow-2xs">
              <div className="prose prose-xs max-w-none dark:prose-invert prose-p:my-2 prose-headings:mt-4 font-medium leading-relaxed text-slate-700 dark:text-slate-200">
                <ReactMarkdown>{activeSummary.content}</ReactMarkdown>
              </div>
            </div>

            {/* وقت التوليد */}
            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 px-1">
              <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                <Sparkles size={12} />
              </div>
              <span>
                {c.generatedAt.replace(
                  "{date}",
                  new Intl.DateTimeFormat(lang, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(activeSummary.generatedAt)),
                )}
              </span>
            </div>
          </div>
        ) : (
          !isPending && (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 shadow-inner">
                <FileText size={24} />
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {c.noSummary}
              </p>
            </div>
          )
        )}

        {/* كتلة الخطأ حصراً */}
        <AiStateBlock error={summaryError} onRetry={generate} />

        {/* أزرار التحكم السفلية بدون أيقونات بالزر الرئيسي */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <Button
            onClick={generate}
            isLoading={isPending}
            disabled={isPending}
            size="sm"
            className="rounded-xl bg-indigo-600 px-5 py-2 text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all cursor-pointer font-semibold"
          >
            <span>{activeSummary ? c.regenerate : c.generate}</span>
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              if (!isPending) close();
            }}
            disabled={isPending}
            size="sm"
            className="rounded-xl border-slate-200 dark:border-slate-700 cursor-pointer font-semibold"
          >
            {c.close}
          </Button>
        </div>

        <p className="text-[11px] font-medium text-slate-400 px-1">
          {c.disclaimer}
        </p>
      </div>
    </Dialog>
  );
}
