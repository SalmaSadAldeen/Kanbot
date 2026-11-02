import { CircleAlert } from "lucide-react";

interface ApiAlertProps {
  message: string;
  onDismiss: () => void;
}

export function ApiAlert({ message, onDismiss }: ApiAlertProps) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="mb-4 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
    >
      <CircleAlert className="mt-0.5 shrink-0" size={18} />
      <span className="flex-1">{message}</span>
      <button
        aria-label="Dismiss error"
        type="button"
        onClick={onDismiss}
        className="rounded text-red-700 hover:text-red-900 focus-visible:outline-none"
      >
        ×
      </button>
    </div>
  );
}
