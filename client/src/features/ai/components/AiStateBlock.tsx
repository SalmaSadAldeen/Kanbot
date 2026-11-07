import { AlertCircle } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { useTranslation } from "../../../store/useAppStore";

export function AiStateBlock({
  error,
  onRetry,
}: {
  loading?: boolean; // تركناها كخاصية اختيارية أوبشنال مشان ما ينضرب أي نوع بيانات (Types) قديم بالبروجكت
  error?: unknown;
  onRetry?: () => void;
}) {
  const { t } = useTranslation();
  const c = t.ai;

  // تم إلغاء عرض رسالة التفكير (thinking) لأنها مطبقة بالفعل داخل الزر الأساسي
  if (error) {
    return (
      <div
        className="space-y-2 rounded-lg border border-rose-200 p-3 text-sm text-rose-700 dark:border-rose-900 dark:text-rose-300"
        role="alert"
      >
        <p className="flex gap-2">
          <AlertCircle size={16} />
          {error instanceof Error ? error.message : c.genericError}
        </p>
        {onRetry && (
          <Button size="sm" variant="outline" onClick={onRetry}>
            {c.tryAgain}
          </Button>
        )}
      </div>
    );
  }

  return null;
}
