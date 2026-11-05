import { useState } from "react";
import { Dialog } from "../../../components/ui/Dialog";
import { Button } from "../../../components/ui/Button";
import { Spinner } from "../../../components/ui/Spinner";
import { useTranslation } from "../../../store/useAppStore";
import type { StartSprintRequest } from "../../../types/api";

interface StartSprintDialogProps {
  isOpen: boolean;
  isPending: boolean;
  hasActiveSprint: boolean;
  onClose: () => void;
  onSubmit: (data: StartSprintRequest) => Promise<void>;
}

export function StartSprintDialog({
  isOpen,
  isPending,
  hasActiveSprint,
  onClose,
  onSubmit,
}: StartSprintDialogProps) {
  const { t } = useTranslation();
  const copy = t.projectsPage.backlogPage.startSprintDialog;

  // حساب تاريخ اليوم وتاريخ بعد 14 يوماً افتراضياً
  const getFormattedDate = (date: Date) => {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
    return local.toISOString().slice(0, 10);
  };

  const today = new Date();
  const defaultEndDate = new Date();
  defaultEndDate.setDate(today.getDate() + 14);

  const [startDate, setStartDate] = useState(getFormattedDate(today));
  const [endDate, setEndDate] = useState(getFormattedDate(defaultEndDate));
  const [dateError, setDateError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hasActiveSprint) return;
    if (endDate < startDate) { setDateError(true); return; }
    setDateError(false);
    await onSubmit({
      startDate: startDate ,
      endDate: endDate ,
    });
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={() => !isPending && onClose()}
      title={copy.title}
    >
      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="space-y-4 pt-1"
        dir="auto"
      >
        {/* تنبيه إذا كان هناك سبرنت نشط آخر */}
        {hasActiveSprint && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-bold text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400">
            ⚠️ {copy.activeSprintWarning}
          </div>
        )}

        {/* تواريخ البداية والنهاية */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="start-sprint-date" className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
              {copy.startDateLabel}
            </label>
            <input
              type="date"
              id="start-sprint-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label htmlFor="end-sprint-date" className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
              {copy.endDateLabel}
            </label>
            <input
              type="date"
              id="end-sprint-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </div>
        {dateError && <p role="alert" className="text-xs text-rose-600">{copy.endDateError}</p>}

        {/* الأزرار */}
        <div className="flex justify-end gap-2.5 border-t border-slate-100 pt-4 dark:border-slate-800/80">
          <Button
            variant="secondary"
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-xl px-4 text-xs font-bold"
          >
            {t.projectsPage.dialog.cancel}
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={isPending || hasActiveSprint}
            className="rounded-xl bg-indigo-600 px-5 text-xs font-bold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 disabled:opacity-50"
          >
            {isPending ? <Spinner size="sm" /> : copy.startBtn}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
