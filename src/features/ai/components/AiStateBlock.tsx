import { AlertCircle, LoaderCircle } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { useTranslation } from "../../../store/useAppStore";

export function AiStateBlock({ loading, error, onRetry }: { loading?: boolean; error?: unknown; onRetry?: () => void }) {
  const { t } = useTranslation(); const c = t.ai;
  if (loading) return <div className="flex items-center gap-2 p-3 text-sm text-slate-500" role="status"><LoaderCircle className="animate-spin" size={16}/>{c.thinking}</div>;
  if (error) return <div className="space-y-2 rounded-lg border border-rose-200 p-3 text-sm text-rose-700 dark:border-rose-900 dark:text-rose-300" role="alert"><p className="flex gap-2"><AlertCircle size={16}/>{error instanceof Error ? error.message : c.genericError}</p>{onRetry && <Button size="sm" variant="outline" onClick={onRetry}>{c.tryAgain}</Button>}</div>;
  return null;
}
