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
  const sprintsQueryKey = ["projects", projectId, "sprints"];

  const sprintsQuery = useQuery({
    queryKey: sprintsQueryKey,
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
    onSuccess: async (newSprint, variables) => {
      queryClient.setQueryData(sprintsQueryKey, (old: Sprint[] = []) => [
        ...old,
        newSprint,
      ]);
      await queryClient.invalidateQueries({ queryKey: sprintsQueryKey });
      if (variables.todoIds?.length) {
        await queryClient.invalidateQueries({
          queryKey: ["projects", projectId, "todos"],
        });
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
    onSuccess: async (updatedSprint) => {
      queryClient.setQueryData(sprintsQueryKey, (old: Sprint[] = []) =>
        old.map((s) => (s.id === updatedSprint.id ? updatedSprint : s)),
      );
      await queryClient.invalidateQueries({ queryKey: sprintsQueryKey });
    },
  });

  const deleteSprintMutation = useMutation({
    mutationFn: (sprintId: string) => deleteSprint(sprintId),
    onSuccess: async (_, deletedSprintId) => {
      queryClient.setQueryData(sprintsQueryKey, (old: Sprint[] = []) =>
        old.filter((s) => s.id !== deletedSprintId),
      );
      await queryClient.invalidateQueries({ queryKey: sprintsQueryKey });
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
    onSuccess: async (startedSprint) => {
      queryClient.setQueryData(sprintsQueryKey, (old: Sprint[] = []) =>
        old.map((s) => (s.id === startedSprint.id ? startedSprint : s)),
      );
      // إبطال شامل للمشروع والسبرنتات لضمان تحديث الـ Active Sprint في البورد فوراً
      await queryClient.invalidateQueries({
        queryKey: ["projects", projectId],
      });
      await queryClient.invalidateQueries({ queryKey: sprintsQueryKey });
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
      queryClient.setQueryData(sprintsQueryKey, (old: Sprint[] = []) =>
        old.map((s) => (s.id === completedSprint.id ? completedSprint : s)),
      );

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["projects", projectId] }),
        queryClient.invalidateQueries({
          queryKey: ["projects", projectId, "todos"],
        }),
        queryClient.invalidateQueries({ queryKey: sprintsQueryKey }),
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
