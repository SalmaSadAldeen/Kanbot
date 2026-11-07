import { request } from "./client";
import type {
  ProjectWithStats,
  CreateProjectRequest,
  UpdateProjectRequest,
} from "../types/api";

export async function listProjects(): Promise<ProjectWithStats[]> {
  const res = await request<{ projects: ProjectWithStats[] }>(
    "GET",
    "/projects",
  );
  return res.projects;
}

export async function getProject(id: string): Promise<ProjectWithStats> {
  const res = await request<{ project: ProjectWithStats }>(
    "GET",
    `/projects/${id}`,
  );
  return res.project;
}

export async function createProject(
  data: CreateProjectRequest,
): Promise<ProjectWithStats> {
  const res = await request<{ project: ProjectWithStats }>(
    "POST",
    "/projects",
    data,
  );
  return res.project;
}

export async function updateProject(
  id: string,
  data: UpdateProjectRequest,
): Promise<ProjectWithStats> {
  // تنبيه: الـ Endpoint حسب الـ Contract هو PATCH وليس PUT
  const res = await request<{ project: ProjectWithStats }>(
    "PATCH",
    `/projects/${id}`,
    data,
  );
  return res.project;
}

export async function deleteProject(id: string): Promise<void> {
  await request<void>("DELETE", `/projects/${id}`);
}
