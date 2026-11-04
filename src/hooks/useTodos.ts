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

// ─────────────────────────────────────────────────────────────────────────────
// Individual todo detail query
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// Helper: invalidate every cache that can contain todos for this project.
// Includes both the backlog/sprint list keys AND the board key for any sprint
// that the todo currently belongs to or is moving to.
// ─────────────────────────────────────────────────────────────────────────────
function buildInvalidations(
  queryClient: ReturnType<typeof useQueryClient>,
  projectId: string | undefined,
  sprintIds?: Array<string | null | undefined>,
) {
  const tasks: Promise<void>[] = [];

  // Backlog / sprint list caches
  tasks.push(
    queryClient.invalidateQueries({
      queryKey: ["projects", projectId, "todos"],
    }),
    queryClient.invalidateQueries({
      queryKey: ["projects", projectId, "sprints"],
    }),
  );

  // Board cache — invalidate for every sprint involved in the operation
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

// ─────────────────────────────────────────────────────────────────────────────
// Main hook
// ─────────────────────────────────────────────────────────────────────────────
export function useTodos(projectId: string | undefined, sprintId?: string) {
  const queryClient = useQueryClient();

  const queryKey = ["projects", projectId, "todos", sprintId ?? "all"];

  // ── List query ──────────────────────────────────────────────────────────────
  const todosQuery = useQuery({
    queryKey,
    queryFn: () =>
      projectId ? getProjectTodos(projectId, sprintId) : Promise.resolve([]),
    enabled: Boolean(projectId),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // ── Create ──────────────────────────────────────────────────────────────────
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

  // ── Update ──────────────────────────────────────────────────────────────────
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

      // Keep the single-todo cache fresh
      queryClient.setQueryData(["todo", updatedTodo.id], updatedTodo);

      // Collect previous sprint (if we have the old todo cached) + new sprint
      const previousTodo = queryClient.getQueryData<Todo>([
        "todo",
        variables.todoId,
      ]);
      const affectedSprints = [
        previousTodo?.sprintId,
        updatedTodo.sprintId,
        // Also invalidate the sprintId passed as optional arg to useTodos
        sprintId,
      ];

      await buildInvalidations(queryClient, projectId, affectedSprints);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update todo");
    },
  });

  // ── Delete ──────────────────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (todoId: string) => deleteTodo(todoId),
    onMutate: async (todoId) => {
      // Snapshot the current list for rollback
      const previous = queryClient.getQueryData<Todo[]>(queryKey);

      // Find the todo before it's gone so we know which sprint board to invalidate
      const target = (previous ?? []).find((t) => t.id === todoId);

      // Optimistically remove from the list
      queryClient.setQueryData<Todo[]>(queryKey, (old = []) =>
        old.filter((t) => t.id !== todoId),
      );

      return { previous, sprintId: target?.sprintId };
    },
    onSuccess: async (_data, _todoId, context) => {
      toast.success("Todo deleted successfully");
      await buildInvalidations(queryClient, projectId, [
        context?.sprintId,
        sprintId,
      ]);
    },
    onError: (error: Error, _todoId, context) => {
      // Roll back optimistic removal
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
      toast.error(error.message || "Failed to delete todo");
    },
  });

  // ── Move (backlog reorder / sprint-to-sprint) ───────────────────────────────
  const moveMutation = useMutation({
    mutationFn: ({
      todoId,
      data,
    }: {
      todoId: string;
      data: MoveTodoRequest;
    }) => moveTodo(todoId, data),

    onMutate: async ({ todoId, data }) => {
      await queryClient.cancelQueries({ queryKey });

      const previousTodos = queryClient.getQueryData<Todo[]>(queryKey);

      // Optimistically update position + sprintId + status in the list
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

      // Invalidate list + any affected board
      const affectedSprints = [
        variables.data.sprintId, // destination sprint (null = backlog, still fine to skip)
        sprintId,                // sprint this hook was scoped to
      ];
      await buildInvalidations(queryClient, projectId, affectedSprints);
    },
  });

  // ─────────────────────────────────────────────────────────────────────────
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
    isMoving: moveMutation.isPending,
  };
}
