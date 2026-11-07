import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  moveTodo,
} from "../api/todos";
import type {
  CreateTodoRequest,
  UpdateTodoRequest,
  MoveTodoRequest,
} from "../types/api";
import type { Todo } from "../types/api";
import toast from "react-hot-toast";

export function useTodoDetails(todoId: string | undefined) {
  return useQuery({
    queryKey: ["todo", todoId],
    queryFn: () => getTodoById(todoId!),
    enabled: Boolean(todoId),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

function buildInvalidations(
  queryClient: ReturnType<typeof useQueryClient>,
  projectId: string | undefined,
  sprintIds?: Array<string | null | undefined>,
) {
  const tasks: Promise<void>[] = [];

  tasks.push(
    queryClient.invalidateQueries({
      queryKey: ["projects", projectId, "todos"],
    }),
    queryClient.invalidateQueries({
      queryKey: ["projects", projectId, "sprints"],
    }),
    queryClient.invalidateQueries({
      queryKey: ["projects", projectId],
    }),
  );
  tasks.push(queryClient.invalidateQueries({ queryKey: ["sprints"] }));

  const uniqueSprints = new Set(
    (sprintIds ?? []).filter((id): id is string => typeof id === "string"),
  );
  for (const sprintId of uniqueSprints) {
    tasks.push(
      queryClient.invalidateQueries({
        queryKey: ["sprints", sprintId, "board"],
      }),
    );
  }

  return Promise.all(tasks);
}

export function useTodos(projectId: string | undefined, sprintId?: string) {
  const queryClient = useQueryClient();
  const queryKey = ["projects", projectId, "todos", sprintId ?? "all"];

  const todosQuery = useQuery({
    queryKey,
    queryFn: () =>
      projectId ? getProjectTodos(projectId, sprintId) : Promise.resolve([]),
    enabled: Boolean(projectId),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateTodoRequest) => {
      if (!projectId) throw new Error("Project ID is required");
      return createTodo(projectId, data);
    },
    onSuccess: async (newTodo) => {
      toast.success("Todo created successfully");
      await buildInvalidations(queryClient, projectId, [newTodo.sprintId]);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create todo");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      todoId,
      data,
    }: {
      todoId: string;
      data: UpdateTodoRequest;
    }) => updateTodo(todoId, data),
    onSuccess: async (updatedTodo, variables) => {
      toast.success("Todo updated successfully");
      queryClient.setQueryData(["todo", updatedTodo.id], updatedTodo);

      const previousTodo = queryClient.getQueryData<Todo>([
        "todo",
        variables.todoId,
      ]);
      const affectedSprints = [
        previousTodo?.sprintId,
        updatedTodo.sprintId,
        sprintId,
      ];

      await buildInvalidations(queryClient, projectId, affectedSprints);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update todo");
    },
  });

  // تعديل الـ deleteMutation ليقبل معامل silent اختياري
  const deleteMutation = useMutation({
    mutationFn: ({ todoId }: { todoId: string; silent?: boolean }) =>
      deleteTodo(todoId),
    onMutate: async ({ todoId }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Todo[]>(queryKey);
      const target = (previous ?? []).find((t) => t.id === todoId);

      queryClient.setQueryData<Todo[]>(queryKey, (old = []) =>
        old.filter((t) => t.id !== todoId),
      );

      return { previous, sprintId: target?.sprintId };
    },
    onSuccess: async (_data, variables, context) => {
      // إظهار التوست فقط إذا لم يتم تفعيل وضع الـ silent
      if (!variables.silent) {
        toast.success("Todo deleted successfully");
      }
      await buildInvalidations(queryClient, projectId, [
        context?.sprintId,
        sprintId,
      ]);
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
      toast.error(error.message || "Failed to delete todo");
    },
  });

  const moveMutation = useMutation({
    mutationFn: ({ todoId, data }: { todoId: string; data: MoveTodoRequest }) =>
      moveTodo(todoId, data),

    onMutate: async ({ todoId, data }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousTodos = queryClient.getQueryData<Todo[]>(queryKey);

      queryClient.setQueryData<Todo[]>(queryKey, (old = []) =>
        old.map((todo) => {
          if (todo.id !== todoId) return todo;
          return {
            ...todo,
            ...(data.sprintId !== undefined && { sprintId: data.sprintId }),
            ...(data.status !== undefined && { status: data.status }),
            order: data.position,
          };
        }),
      );

      return { previousTodos };
    },

    onError: (err: Error, _variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(queryKey, context.previousTodos);
      }
      toast.error(err.message || "Failed to move todo. Rolling back.");
    },

    onSuccess: async (_updatedTodo, variables) => {
      toast.success("Todo moved successfully");
      const affectedSprints = [variables.data.sprintId, sprintId];
      await buildInvalidations(queryClient, projectId, affectedSprints);
    },
  });

  return {
    todos: todosQuery.data ?? [],
    isLoading: todosQuery.isLoading,
    error: todosQuery.error,
    refetch: todosQuery.refetch,

    createTodo: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    updateTodo: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    // تحديث دالة الحذف لتستقبل المعامل الاختياري (ويمكن استدعاؤها هكذا: deleteTodo({ todoId, silent: true }))
    deleteTodo: (todoId: string, silent?: boolean) =>
      deleteMutation.mutateAsync({ todoId, silent }),
    isDeleting: deleteMutation.isPending,

    moveTodo: moveMutation.mutateAsync,
    isMoving: moveMutation.isPending,
  };
}
