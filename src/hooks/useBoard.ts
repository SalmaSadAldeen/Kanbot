import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSprintBoard } from "../api/sprints";
import { moveTodo } from "../api/todos";
import type { SprintBoardResponse, Todo, TodoStatus, MoveTodoRequest } from "../types/api";
import { TODO_STATUSES } from "../types/api";
import toast from "react-hot-toast";

/**
 * Fetches the board layout for a specific sprint and provides a
 * board-aware moveTodo mutation with full optimistic updates and rollback.
 *
 * The board cache key is  ["sprints", sprintId, "board"]
 * which matches what useBoard already used — existing invalidations stay valid.
 */
export function useBoard(sprintId: string | undefined) {
  const queryClient = useQueryClient();
  const queryKey = ["sprints", sprintId, "board"] as const;

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const boardQuery = useQuery<SprintBoardResponse>({
    queryKey,
    queryFn: () => getSprintBoard(sprintId!),
    enabled: Boolean(sprintId),
    staleTime: 1000 * 60 * 2,   // board is more volatile than backlog
    refetchOnWindowFocus: true,
  });

  // ── Board-level move with optimistic update ────────────────────────────────
  const moveMutation = useMutation({
    mutationFn: ({
      todoId,
      data,
    }: {
      todoId: string;
      data: MoveTodoRequest;
    }) => moveTodo(todoId, data),

    onMutate: async ({ todoId, data }) => {
      // Cancel any in-flight refetch so it doesn't overwrite our optimistic state
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<SprintBoardResponse>(queryKey);

      if (previous) {
        queryClient.setQueryData<SprintBoardResponse>(queryKey, (old) => {
          if (!old) return old;

          // Build a mutable deep copy of columns
          const cols = {} as Record<TodoStatus, Todo[]>;
          for (const status of TODO_STATUSES) {
            cols[status] = [...old.columns[status]];
          }

          // Find and remove the card from its source column
          let movedTodo: Todo | undefined;
          for (const status of TODO_STATUSES) {
            const idx = cols[status].findIndex((t) => t.id === todoId);
            if (idx !== -1) {
              [movedTodo] = cols[status].splice(idx, 1);
              break;
            }
          }

          if (!movedTodo) return old;

          // Apply the new status/sprintId from the move request
          const updatedTodo: Todo = {
            ...movedTodo,
            ...(data.status !== undefined && { status: data.status }),
            ...(data.sprintId !== undefined && { sprintId: data.sprintId }),
            order: data.position,
          };

          // Insert into the target column at the requested position
          const targetStatus = data.status ?? movedTodo.status;
          const targetCol = cols[targetStatus];
          const insertAt = Math.min(data.position, targetCol.length);
          targetCol.splice(insertAt, 0, updatedTodo);

          // Re-assign order based on final positions
          for (const status of TODO_STATUSES) {
            cols[status] = cols[status].map((t, i) => ({ ...t, order: i }));
          }

          return { ...old, columns: cols };
        });
      }

      return { previous };
    },

    onError: (_err, _vars, context) => {
      // Roll back to the snapshot taken before the optimistic update
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
      toast.error("Failed to move card. Changes rolled back.");
    },

    onSuccess: () => {
      // Server is the source of truth — invalidate to get accurate order values
      void queryClient.invalidateQueries({ queryKey });
    },
  });

  // ── Convenience wrapper ────────────────────────────────────────────────────
  const moveCard = useCallback(
    (todoId: string, data: MoveTodoRequest) =>
      moveMutation.mutate({ todoId, data }),
    [moveMutation],
  );

  return {
    sprint: boardQuery.data?.sprint,
    columns: boardQuery.data?.columns,
    isLoading: boardQuery.isLoading,
    isError: boardQuery.isError,
    error: boardQuery.error,
    refetch: boardQuery.refetch,
    moveCard,
    isMoving: moveMutation.isPending,
  };
}
