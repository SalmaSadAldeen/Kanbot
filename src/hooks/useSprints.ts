import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectSprints,
  createSprint,
  updateSprint,
  deleteSprint,
  startSprint,
  completeSprint,
} from "../api/sprints";
import type {
  CreateSprintRequest,
  UpdateSprintRequest,
  StartSprintRequest,
  CompleteSprintRequest,
  Sprint,
} from "../types/api";

export function useSprints(projectId: string | undefined) {
  const queryClient = useQueryClient();

  const sprintsQuery = useQuery({
    queryKey: ["projects", projectId, "sprints"],
    queryFn: () => {
      if (!projectId) throw new Error("Project ID is required");
      return getProjectSprints(projectId);
    },
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const createSprintMutation = useMutation({
    mutationFn: (data: CreateSprintRequest = {}) => {
      if (!projectId) throw new Error("Project ID is required");
      return createSprint(projectId, data);
    },
    onSuccess: (newSprint, variables) => {
      queryClient.setQueryData(
        ["projects", projectId, "sprints"],
        (old: Sprint[] = []) => [...old, newSprint],
      );
      if (variables.todoIds?.length) {
        void Promise.all([
          queryClient.invalidateQueries({
            queryKey: ["projects", projectId, "todos"],
          }),
          queryClient.invalidateQueries({
            queryKey: ["projects", projectId, "sprints"],
          }),
        ]);
      }
    },
  });

  const updateSprintMutation = useMutation({
    mutationFn: ({
      sprintId,
      data,
    }: {
      sprintId: string;
      data: UpdateSprintRequest;
    }) => updateSprint(sprintId, data),
    onSuccess: (updatedSprint) => {
      queryClient.setQueryData(
        ["projects", projectId, "sprints"],
        (old: Sprint[] = []) =>
          old.map((s) => (s.id === updatedSprint.id ? updatedSprint : s)),
      );
    },
  });

  const deleteSprintMutation = useMutation({
    mutationFn: (sprintId: string) => deleteSprint(sprintId),
    onSuccess: (_, deletedSprintId) => {
      queryClient.setQueryData(
        ["projects", projectId, "sprints"],
        (old: Sprint[] = []) => old.filter((s) => s.id !== deletedSprintId),
      );
    },
  });

  const startSprintMutation = useMutation({
    mutationFn: ({
      sprintId,
      data,
    }: {
      sprintId: string;
      data: StartSprintRequest;
    }) => startSprint(sprintId, data),
    onSuccess: (startedSprint) => {
      queryClient.setQueryData(
        ["projects", projectId, "sprints"],
        (old: Sprint[] = []) =>
          old.map((s) => (s.id === startedSprint.id ? startedSprint : s)),
      );
    },
  });

  const completeSprintMutation = useMutation({
    mutationFn: ({
      sprintId,
      data,
    }: {
      sprintId: string;
      data: CompleteSprintRequest;
    }) => completeSprint(sprintId, data),
    onSuccess: async (completedSprint) => {
      queryClient.setQueryData(
        ["projects", projectId, "sprints"],
        (old: Sprint[] = []) =>
          old.map((s) => (s.id === completedSprint.id ? completedSprint : s)),
      );

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

  const allSprints = sprintsQuery.data ?? [];
  const plannedSprints = allSprints.filter((s) => s.status === "planned");

  return {
    sprints: plannedSprints,
    allSprints,
    isLoading: sprintsQuery.isLoading,
    error: sprintsQuery.error,
    refetch: sprintsQuery.refetch,
    createSprint: createSprintMutation,
    updateSprint: updateSprintMutation,
    deleteSprint: deleteSprintMutation,
    completeSprint: completeSprintMutation,
    startSprint: startSprintMutation,
  };
}
