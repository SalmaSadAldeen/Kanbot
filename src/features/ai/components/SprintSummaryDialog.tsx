import { useEffect, useRef } from "react";
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
  const { mutate, isPending, error: summaryError } = summaryMutation;
  const attemptedFor = useRef<string | null>(null);
  useEffect(() => {
    if (id && query.isSuccess && !query.data.summary && attemptedFor.current !== id) {
      attemptedFor.current = id;
      mutate(id);
    }
  }, [id, query.isSuccess, query.data?.summary, mutate]);
  const generate = () => {
    if (id) mutate(id);
  };
  return (
    <Dialog isOpen={!!id} onClose={() => { if (!isPending) close(); }} title={c.summaryTitle} maxWidth="lg">
      <div className="space-y-3">
        {query.isLoading ? (
          <AiStateBlock loading />
        ) : query.error ? (
          <AiStateBlock
            error={query.error}
            onRetry={() => void query.refetch()}
          />
        ) : query.data?.summary ? (
          <>
            <ReactMarkdown>{query.data.summary.content}</ReactMarkdown>
            <p className="text-xs text-slate-500">
              {c.generatedAt.replace(
                "{date}",
                new Intl.DateTimeFormat(lang, {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(query.data.summary.generatedAt)),
              )}
            </p>
          </>
        ) : (
          <p className="text-sm text-slate-500">{c.noSummary}</p>
        )}
        <AiStateBlock
          loading={isPending}
          error={summaryError}
          onRetry={generate}
        />
        <Button
          onClick={generate}
          isLoading={isPending}
          disabled={isPending}
        >
          {query.data?.summary ? c.regenerate : c.summarize}
        </Button>
        <Button variant="secondary" onClick={close} disabled={isPending}>{c.close}</Button>
      </div>
    </Dialog>
  );
}
