import { request } from "./client";
import type {
  Todo,
  TodoListResponse,
  CreateTodoRequest,
  UpdateTodoRequest,
  MoveTodoRequest,
  BulkCreateTodosResponse,
  BulkCreateTodosRequest,
} from "../types/api";

/** 1. جلب مهام المشروع (مع إمكانية الفلترة أو جلب الباكلوغ) */
export async function getProjectTodos(
  projectId: string,
  sprintId?: string,
): Promise<Todo[]> {
  const query = sprintId ? `?sprintId=${sprintId}` : "";
  const data = await request<TodoListResponse>(
    "GET",
    `/projects/${projectId}/todos${query}`,
  );
  return data.todos;
}

/** 2. جلب تفاصيل مهمة محددة */
export async function getTodoById(todoId: string): Promise<Todo> {
  const data = await request<{ todo: Todo }>("GET", `/todos/${todoId}`);
  return data.todo;
}

/** 3. إنشاء مهمة جديدة (تضاف للباكلوغ أو سبرنت معين) */
export async function createTodo(
  projectId: string,
  todoData: CreateTodoRequest,
): Promise<Todo> {
  const data = await request<{ todo: Todo }>(
    "POST",
    `/projects/${projectId}/todos`,
    todoData,
  );
  return data.todo;
}

/** 4. تعديل مهمة (PATCH) */
export async function updateTodo(
  todoId: string,
  updateData: UpdateTodoRequest,
): Promise<Todo> {
  const data = await request<{ todo: Todo }>(
    "PATCH",
    `/todos/${todoId}`,
    updateData,
  );
  return data.todo;
}

/** 5. حذف مهمة (DELETE) */
export async function deleteTodo(todoId: string): Promise<void> {
  await request("DELETE", `/todos/${todoId}`);
}

/** 6. نقل وترتيب المهمة (Move / Drag & Drop) */
export async function moveTodo(
  todoId: string,
  moveData: MoveTodoRequest,
): Promise<Todo> {
  const data = await request<{ todo: Todo }>(
    "POST",
    `/todos/${todoId}/move`,
    moveData,
  );
  return data.todo;
}
export async function bulkCreateTodos(
  projectId: string,
  data: BulkCreateTodosRequest,
): Promise<Todo[]> {
  const res = await request<BulkCreateTodosResponse>(
    "POST",
    `/projects/${projectId}/todos/bulk`,
    data,
  );
  return res.todos;
}
