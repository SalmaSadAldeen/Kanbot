import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectSprints,
  createSprint,
  updateSprint,
  deleteSprint,
  startSprint,
} from "../api/sprints";
import type {
  CreateSprintRequest,
  UpdateSprintRequest,
  StartSprintRequest,
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
  });

  const invalidateSprints = () => {
    if (!projectId) return;
    void queryClient.invalidateQueries({
      queryKey: ["projects", projectId, "sprints"],
    });
    void queryClient.invalidateQueries({
      queryKey: ["projects", projectId, "backlog-todos"],
    });
  };

  const createSprintMutation = useMutation({
    mutationFn: (data: CreateSprintRequest = {}) => {
      if (!projectId) throw new Error("Project ID is required");
      return createSprint(projectId, data);
    },
    onSuccess: invalidateSprints,
  });

  const updateSprintMutation = useMutation({
    mutationFn: ({
      sprintId,
      data,
    }: {
      sprintId: string;
      data: UpdateSprintRequest;
    }) => updateSprint(sprintId, data),
    onSuccess: invalidateSprints,
  });

  const deleteSprintMutation = useMutation({
    mutationFn: (sprintId: string) => deleteSprint(sprintId),
    onSuccess: invalidateSprints,
  });

  const startSprintMutation = useMutation({
    mutationFn: ({
      sprintId,
      data,
    }: {
      sprintId: string;
      data: StartSprintRequest;
    }) => startSprint(sprintId, data),
    onSuccess: invalidateSprints,
  });

  const allSprints = sprintsQuery.data ?? [];
  const plannedSprints = allSprints.filter((s) => s.status === "planned");

  return {
    sprints: plannedSprints,
    allSprints, // هذه هي المصفوفة الشاملة التي تحل مشكلة تعطيل الزر تماماً
    isLoading: sprintsQuery.isLoading,
    error: sprintsQuery.error,
    refetch: sprintsQuery.refetch,
    createSprint: createSprintMutation,
    updateSprint: updateSprintMutation,
    deleteSprint: deleteSprintMutation,
    startSprint: startSprintMutation,
  };
}
