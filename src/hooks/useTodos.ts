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
import type { Todo } from "../types/api"; // أو مسار الـ Todo الصحيح عندك
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
    onSuccess: async () => {
      toast.success("Todo created successfully");
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["projects", projectId, "todos"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["projects", projectId, "sprints"],
        }),
      ]);
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
    onSuccess: async (updatedTodo) => {
      toast.success("Todo updated successfully");
      queryClient.setQueryData(["todo", updatedTodo.id], updatedTodo);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["projects", projectId, "todos"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["projects", projectId, "sprints"],
        }),
      ]);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update todo");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (todoId: string) => deleteTodo(todoId),
    onSuccess: async () => {
      toast.success("Todo deleted successfully");
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["projects", projectId, "todos"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["projects", projectId, "sprints"],
        }),
      ]);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete todo");
    },
  });

const moveMutation = useMutation({
    mutationFn: ({ todoId, data }: { todoId: string; data: MoveTodoRequest }) =>
      moveTodo(todoId, data),

    // Optimistic Update مع الـ Rollback الحقيقي وتوافق تام مع الـ TypeScript
    onMutate: async ({ todoId, data }) => {
      await queryClient.cancelQueries({ queryKey });

      const previousTodos = queryClient.getQueryData<Todo[]>(queryKey);

      queryClient.setQueryData<Todo[]>(queryKey, (old = []) => {
        return old.map((todo) => {
          if (todo.id === todoId) {
            return {
              ...todo,
              ...(data.sprintId !== undefined && { sprintId: data.sprintId }),
              ...(data.status !== undefined && { status: data.status }),
              // استخدام position بدلاً من order لأن هذا ما ترسله MoveTodoRequest
              ...(data.position !== undefined && { order: data.position }),
            };
          }
          return todo;
        });
      });

      return { previousTodos };
    },

    onError: (err: Error, _variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(queryKey, context.previousTodos);
      }
      toast.error(err.message || "Failed to move todo. Rolling back.");
    },

    onSuccess: async () => {
      toast.success("Todo moved successfully");
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["projects", projectId, "todos"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["projects", projectId, "sprints"],
        }),
      ]);
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
    deleteTodo: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    moveTodo: moveMutation.mutateAsync,
  };
}