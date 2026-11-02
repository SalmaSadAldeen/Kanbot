import { z } from "zod";

// تعريف نوع الترجمة الخاص بهذا السكيما بدقة بدون أي استخدام لـ any
export interface ProjectTranslation {
  projectsPage: {
    validation: {
      nameRequired: string;
      nameMax: string;
      keyFormat: string;
      descMax: string;
    };
  };
}

export const createProjectSchema = (t: ProjectTranslation) =>
  z.object({
    name: z
      .string()
      .min(1, t.projectsPage.validation.nameRequired)
      .max(80, t.projectsPage.validation.nameMax),
    key: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^[A-Z]{2,6}$/, t.projectsPage.validation.keyFormat)
      .optional()
      .or(z.literal("")),
    description: z
      .string()
      .max(500, t.projectsPage.validation.descMax)
      .optional()
      .or(z.literal("")),
  });

export type ProjectFormData = z.infer<ReturnType<typeof createProjectSchema>>;
