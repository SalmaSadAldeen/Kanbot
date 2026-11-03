import { request } from "./client";
import type {
  Sprint,
  CreateSprintRequest,
  UpdateSprintRequest,
  StartSprintRequest,
  CompleteSprintRequest,
} from "../types/api";

// جلب السبرنتات الخاصة بالمشروع
export async function getProjectSprints(projectId: string): Promise<Sprint[]> {
  const data = await request<{ sprints: Sprint[] }>(
    "GET",
    `/projects/${projectId}/sprints`,
  );
  return data.sprints;
}

// إنشاء سبرنت جديد (SPR-1)
export async function createSprint(
  projectId: string,
  data: CreateSprintRequest = {},
): Promise<Sprint> {
  const res = await request<{ sprint: Sprint }>(
    "POST",
    `/projects/${projectId}/sprints`,
    data,
  );
  return res.sprint;
}

// تعديل سبرنت (SPR-2)
export async function updateSprint(
  sprintId: string,
  data: UpdateSprintRequest,
): Promise<Sprint> {
  const res = await request<{ sprint: Sprint }>(
    "PATCH",
    `/sprints/${sprintId}`,
    data,
  );
  return res.sprint;
}

// حذف سبرنت مخطط له (SPR-2)
export async function deleteSprint(sprintId: string): Promise<void> {
  await request<void>("DELETE", `/sprints/${sprintId}`);
}

// بدء سبرنت مخطط له (SPR-3)
export async function startSprint(
  sprintId: string,
  data: StartSprintRequest = {},
): Promise<Sprint> {
  const res = await request<{ sprint: Sprint }>(
    "POST",
    `/sprints/${sprintId}/start`,
    data,
  );
  return res.sprint;
}

// إنهاء سبرنت نشط (SPR-6)
export async function completeSprint(
  sprintId: string,
  data: CompleteSprintRequest,
): Promise<Sprint> {
  const res = await request<{ sprint: Sprint }>(
    "POST",
    `/sprints/${sprintId}/complete`,
    data,
  );
  return res.sprint;
}

