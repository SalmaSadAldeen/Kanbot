import { Dialog } from "../../components/ui/Dialog";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { ProjectDescriptionField } from "./components/ProjectDescriptionField";
import { useProjectForm } from "../../hooks/useProjectForm.ts";
import type { ProjectWithStats } from "../../types/api";

interface ProjectFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (projectId: string) => void;
  projectToEdit?: ProjectWithStats | null;
}

export function ProjectFormDialog(props: ProjectFormDialogProps) {
  const {
    t,
    register,
    handleSubmit,
    errors,
    isEditing,
    isSaving,
    descriptionValue,
  } = useProjectForm(props);

  return (
    <Dialog
      isOpen={props.isOpen}
      onClose={props.onClose}
      title={
        isEditing
          ? t.projectsPage.dialog.editTitle
          : t.projectsPage.dialog.createTitle
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label={t.projectsPage.dialog.nameLabel}
          placeholder={t.projectsPage.dialog.namePlaceholder}
          maxLength={80}
          autoFocus
          required
          disabled={isSaving}
          error={errors.name?.message}
          {...register("name")}
        />

        <div>
          <Input
            label={t.projectsPage.dialog.keyLabel}
            placeholder={t.projectsPage.dialog.keyPlaceholder}
            maxLength={6}
            disabled={isSaving}
            error={errors.key?.message}
            aria-describedby="project-key-hint"
            {...register("key", {
              onChange: (e) => {
                e.target.value = e.target.value
                  .replace(/[^a-zA-Z]/g, "")
                  .toUpperCase();
              },
            })}
          />
          <p
            id="project-key-hint"
            className="mt-1 text-[11px] text-slate-400 dark:text-slate-500"
          >
            {t.projectsPage.dialog.keyHint}
          </p>
        </div>

        <ProjectDescriptionField
          label={t.projectsPage.dialog.descLabel}
          placeholder={t.projectsPage.dialog.descPlaceholder}
          maxLength={500}
          value={descriptionValue}
          disabled={isSaving}
          error={errors.description?.message}
          registration={register("description")}
        />

        {errors.root?.message && (
          <p
            className="text-sm font-medium text-rose-600 dark:text-rose-400"
            role="alert"
          >
            {errors.root.message}
          </p>
        )}

        {/* أزرار الحفظ والإلغاء بألوان الهوية (Indigo) وخالية من الأسود */}
        <div className="flex justify-end gap-2.5 border-t border-slate-100 pt-4 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            onClick={props.onClose}
            disabled={isSaving}
            className="rounded-xl border-slate-200 bg-slate-50/50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer transition-all"
          >
            {t.projectsPage.dialog.cancel}
          </Button>
          <Button
            type="submit"
            isLoading={isSaving}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-700 active:scale-95 dark:bg-indigo-600 dark:hover:bg-indigo-500 cursor-pointer"
          >
            {isEditing
              ? t.projectsPage.dialog.save
              : t.projectsPage.dialog.create}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
