import type { Sprint, CreateSprintRequest } from "../../../types/api";
import { useTranslation } from "../../../store/useAppStore";
import { Dialog } from "../../../components/ui/Dialog";
import { Button } from "../../../components/ui/Button";
import { Spinner } from "../../../components/ui/Spinner";
import { fieldErrors } from "../../../api/client";

interface SprintFormDialogProps {
  isOpen: boolean;
  sprintToEdit?: Sprint | null;
  isPending: boolean;
  error?: unknown;
  onClose: () => void;
  onSubmit: (data: CreateSprintRequest) => Promise<void>;
}

export function SprintFormDialog({
  isOpen,
  sprintToEdit,
  isPending,
  error,
  onClose,
  onSubmit,
}: SprintFormDialogProps) {
  const { t } = useTranslation();
  const copy = t.projectsPage.backlogPage;

  const errors = fieldErrors(error);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const name = (formData.get("name") as string)?.trim();
    const goal = (formData.get("goal") as string)?.trim();
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;

    await onSubmit({
      name: name || undefined,
      goal: goal || undefined,
      startDate: startDate || null,
      endDate: endDate || null,
    });
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={() => !isPending && onClose()}
      title={sprintToEdit ? copy.editSprint : copy.createSprint}
    >
      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="space-y-4 pt-1"
        dir="auto"
      >
        {/* اسم السبرنت */}
        <div>
          <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
            {copy.sprintNameLabel}
          </label>
          <input
            type="text"
            name="name"
            defaultValue={sprintToEdit?.name ?? ""}
            placeholder={copy.sprintNamePlaceholder}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
          />
          {errors.name && (
            <p className="mt-1 text-[11px] font-bold text-rose-500">
              {errors.name}
            </p>
          )}
        </div>

        {/* هدف السبرنت */}
        <div>
          <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
            {copy.sprintGoalLabel}
          </label>
          <textarea
            name="goal"
            defaultValue={sprintToEdit?.goal ?? ""}
            maxLength={300}
            rows={3}
            placeholder={copy.sprintGoalPlaceholder}
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
          />
          {errors.goal && (
            <p className="mt-1 text-[11px] font-bold text-rose-500">
              {errors.goal}
            </p>
          )}
        </div>

        {/* التواريخ */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
              {copy.startDateLabel}
            </label>
            <input
              type="date"
              name="startDate"
              defaultValue={sprintToEdit?.startDate ?? ""}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
              {copy.endDateLabel}
            </label>
            <input
              type="date"
              name="endDate"
              defaultValue={sprintToEdit?.endDate ?? ""}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </div>
        {errors.endDate && (
          <p className="text-[11px] font-bold text-rose-500">
            {errors.endDate}
          </p>
        )}

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
            disabled={isPending}
            className="rounded-xl bg-indigo-600 px-5 text-xs font-bold shadow-md shadow-indigo-600/20 hover:bg-indigo-700"
          >
            {isPending ? <Spinner size="sm" /> : t.projectsPage.dialog.save}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
