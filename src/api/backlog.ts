import { request } from "./client";
import type {

  Todo,
  TodoListResponse,
} from "../types/api";

/** جلب جميع مهام الباكلوج الخاصة بالمشروع (sprintId = backlog) */
export async function getBacklogTodos(projectId: string): Promise<Todo[]> {
  const data = await request<TodoListResponse>(
    "GET",
    `/projects/${projectId}/todos?sprintId=backlog`,
  );
  return data.todos;
}



