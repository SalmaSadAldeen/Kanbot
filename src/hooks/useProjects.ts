import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "../api/projects";
import type { CreateProjectRequest, UpdateProjectRequest } from "../types/api";
import { ApiError } from "../api/client";
import toast from "react-hot-toast";

export const projectsKeys = {
  all: ["projects"] as const,
  detail: (id: string) => ["projects", id] as const,
};

export function useProjects() {
  const queryClient = useQueryClient();

  const projectsQuery = useQuery({
    queryKey: projectsKeys.all,
    queryFn: listProjects,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateProjectRequest) => createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectsKeys.all });
      toast.success("Project created successfully");
    },
    onError: (err: unknown) => {
      const message =
        err instanceof ApiError ? err.message : "Failed to create project";
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectRequest }) =>
      updateProject(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: projectsKeys.all });
      queryClient.invalidateQueries({
        queryKey: projectsKeys.detail(variables.id),
      });
      toast.success("Project updated successfully");
    },
    onError: (err: unknown) => {
      const message =
        err instanceof ApiError ? err.message : "Failed to update project";
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectsKeys.all });
      toast.success("Project deleted successfully");
    },
    onError: (err: unknown) => {
      const message =
        err instanceof ApiError ? err.message : "Failed to delete project";
      toast.error(message);
    },
  });

  return {
    ...projectsQuery,
    projects: projectsQuery.data ?? [],
    createProject: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateProject: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteProject: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}

export function useProject(id: string) {
  return useQuery({
    queryKey: projectsKeys.detail(id),
    queryFn: () => getProject(id),
    enabled: !!id,
  });
}
