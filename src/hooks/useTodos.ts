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
import toast from "react-hot-toast";

export function useTodoDetails(todoId: string | undefined) {
  return useQuery({
    queryKey: ["todo", todoId],
    queryFn: () => getTodoById(todoId!),
    enabled: Boolean(todoId),
    staleTime: 1000 * 60 * 5,
  });
}

export function useTodos(projectId: string | undefined, sprintId?: string) {
  const queryClient = useQueryClient();

  const todosQuery = useQuery({
    queryKey: ["projects", projectId, "todos", sprintId ?? "all"],
    queryFn: () =>
      projectId ? getProjectTodos(projectId, sprintId) : Promise.resolve([]),
    enabled: Boolean(projectId),
    staleTime: 1000 * 60 * 2,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateTodoRequest) => {
      if (!projectId) throw new Error("Project ID is required");
      return createTodo(projectId, data);
    },
    onSuccess: async () => {
      toast.success("Todo created successfully");
      await queryClient.invalidateQueries({
        queryKey: ["projects", projectId, "todos"],
      });
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
      await queryClient.invalidateQueries({
        queryKey: ["projects", projectId, "todos"],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update todo");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (todoId: string) => deleteTodo(todoId),
    onSuccess: async () => {
      toast.success("Todo deleted successfully");
      await queryClient.invalidateQueries({
        queryKey: ["projects", projectId, "todos"],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete todo");
    },
  });
  const moveMutation = useMutation({
    mutationFn: ({ todoId, data }: { todoId: string; data: MoveTodoRequest }) =>
      moveTodo(todoId, data),
    onSuccess: async () => {
      toast.success("Todo moved successfully");
      // إبطال كاش المشروع بالكامل لضمان تحديث الباكلوغ والسبرنتات حالاً
      await queryClient.invalidateQueries({
        queryKey: ["projects", projectId],
      });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to move todo");
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
