import { CircleAlert, X } from "lucide-react";
import { useTranslation } from "../../../store/useAppStore";

interface ApiAlertProps {
  message: string;
  onDismiss: () => void;
}

export function ApiAlert({ message, onDismiss }: ApiAlertProps) {
  const { t } = useTranslation();
  if (!message) return null;

  return (
    <div
      role="alert"
      className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
    >
      <div className="flex items-start gap-3 flex-1">
        <CircleAlert className="mt-0.5 shrink-0" size={18} />
        <span className="flex-1">{message}</span>
      </div>

      <button
        aria-label={t.authFrame.dismissError}
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded p-1 text-red-700 hover:bg-red-100 hover:text-red-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 dark:text-red-400 dark:hover:bg-red-900/50 dark:hover:text-red-200"
      >
        <X size={16} />
      </button>
    </div>
  );
}
