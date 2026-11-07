import { request } from "./client";
import type {
  AiStatusResponse,
  ChatMessage,
  ChatRequest,
  ChatResponse,
  GenerateTodosRequest,
  GenerateTodosResponse,
  PlanSprintRequest,
  PlanSprintResponse,
  SprintSummaryResponse,
} from "../types/api";

export const getAiStatus = () => request<AiStatusResponse>("GET", "/ai/status");

export const aiChat = (projectId: string, messages: ChatMessage[]) =>
  request<ChatResponse>("POST", `/projects/${projectId}/ai/chat`, {
    messages,
  } satisfies ChatRequest);

export const aiGenerateTodos = (
  projectId: string,
  body: GenerateTodosRequest,
) =>
  request<GenerateTodosResponse>(
    "POST",
    `/projects/${projectId}/ai/generate-todos`,
    body,
  );

export const aiPlanSprint = (projectId: string, body: PlanSprintRequest) =>
  request<PlanSprintResponse>(
    "POST",
    `/projects/${projectId}/ai/plan-sprint`,
    body,
  );

export const aiSummarizeSprint = (sprintId: string) =>
  request<SprintSummaryResponse>("POST", `/sprints/${sprintId}/ai/summary`);
