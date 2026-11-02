import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProjects } from "../hooks/useProjects";
import { useTranslation } from "../store/useAppStore";
import {
  createProjectSchema,
  type ProjectFormData,
} from "../features/projects/projectSchema";
import type {
  ProjectWithStats,
  CreateProjectRequest,
  UpdateProjectRequest,
} from "../types/api";
import { ApiError, fieldErrors } from "../api/client";

interface UseProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (projectId: string) => void;
  projectToEdit?: ProjectWithStats | null;
}

export function useProjectForm({
  isOpen,
  onClose,
  onCreated,
  projectToEdit,
}: UseProjectFormProps) {
  const { t } = useTranslation();
  const { createProject, updateProject, isCreating, isUpdating } =
    useProjects();
  const isEditing = Boolean(projectToEdit);
  const isSaving = isCreating || isUpdating;

  // توليد الـ schema مباشرة مع الترجمة الحالية
  const schema = useMemo(() => createProjectSchema(t), [t]);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", key: "", description: "" },
  });

  const descriptionValue = watch("description") ?? "";

  useEffect(() => {
    if (isOpen) {
      reset({
        name: projectToEdit?.name ?? "",
        key: projectToEdit?.key ?? "",
        description: projectToEdit?.description ?? "",
      });
    }
  }, [projectToEdit, isOpen, reset]);

  const onSubmit = async (data: ProjectFormData) => {
    try {
      const trimmedKey = data.key?.trim();
      const trimmedDesc = data.description?.trim();

      const payload = {
        name: data.name.trim(),
        key:
          trimmedKey && trimmedKey.length > 0
            ? trimmedKey.toUpperCase()
            : undefined,
        description:
          trimmedDesc && trimmedDesc.length > 0 ? trimmedDesc : undefined,
      };

      if (isEditing && projectToEdit) {
        await updateProject({
          id: projectToEdit.id,
          data: payload as UpdateProjectRequest,
        });
      } else {
        const created = await createProject(payload as CreateProjectRequest);
        if (created?.id) onCreated?.(created.id);
      }
      onClose();
    } catch (error: unknown) {
      if (
        error instanceof ApiError &&
        (error.status === 409 || error.code === "CONFLICT")
      ) {
        setError("key", {
          type: "manual",
          message: t.projectsPage.validation.conflictKey,
        });
      } else {
        const apiFieldErrors = fieldErrors(error);
        if (Object.keys(apiFieldErrors).length > 0) {
          if (apiFieldErrors.name)
            setError("name", { type: "server", message: apiFieldErrors.name });
          if (apiFieldErrors.key)
            setError("key", { type: "server", message: apiFieldErrors.key });
          if (apiFieldErrors.description)
            setError("description", {
              type: "server",
              message: apiFieldErrors.description,
            });
        } else {
          setError("root", {
            type: "server",
            message:
              error instanceof Error
                ? error.message
                : t.projectsPage.validation.genericError,
          });
        }
      }
    }
  };

  return {
    t,
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isEditing,
    isSaving,
    descriptionValue,
  };
}
