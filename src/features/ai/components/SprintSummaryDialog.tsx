import { useQuery } from "@tanstack/react-query";
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
      <div className="space-y-4">
        {query.isLoading ? (
          <AiStateBlock loading />
        ) : query.error ? (
          <AiStateBlock
            error={query.error}
            onRetry={() => void query.refetch()}
          />
        ) : activeSummary ? (
          <>
            <div className="prose prose-slate max-w-none dark:prose-invert prose-p:my-2 prose-headings:mt-4">
              <ReactMarkdown>{activeSummary.content}</ReactMarkdown>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {c.generatedAt.replace(
                "{date}",
                new Intl.DateTimeFormat(lang, {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(activeSummary.generatedAt)),
              )}
            </p>
          </>
        ) : (
          !isPending && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {c.noSummary}
            </p>
          )
        )}

        {/* يظهر الـ Spinner فقط في حالة وجود كورس جاري أو خطأ بالتوليد */}
        {(isPending || summaryError) && (
          <AiStateBlock
            loading={isPending}
            error={summaryError}
            onRetry={generate}
          />
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-3 dark:border-slate-800">
          <Button onClick={generate} isLoading={isPending} disabled={isPending}>
            {activeSummary ? c.regenerate : c.generate}
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              if (!isPending) close();
            }}
            disabled={isPending}
          >
            {c.close}
          </Button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          {c.disclaimer}
        </p>
      </div>
    </Dialog>
  );
}
