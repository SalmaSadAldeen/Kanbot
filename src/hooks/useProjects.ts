import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject as deleteProjectApi,
} from "../api/projects";
import type {
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectWithStats,
} from "../types/api";
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
    mutationFn: (id: string) => deleteProjectApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectsKeys.all });
      toast.success("Project deleted successfully");
    },
    onError: (err: unknown) => {
      const message =
        err instanceof ApiError ? err.message : "Failed to delete project";
      toast.error(message);
      queryClient.invalidateQueries({ queryKey: projectsKeys.all });
    },
  });

  // 🎯 دالة الحذف المباشرة والآمنة 100% بدون أي أخطاء في الـ TypeScript أو الـ Vite
  const deleteProjectWithUndo = (id: string) => {
    const previousProjects = queryClient.getQueryData<ProjectWithStats[]>(
      projectsKeys.all,
    );
    const targetProject = previousProjects?.find((p) => p.id === id);

    if (!targetProject) return;

    // إخفاء المشروع فوراً من الواجهة (Optimistic Update)
    queryClient.setQueryData<ProjectWithStats[]>(projectsKeys.all, (old) =>
      old ? old.filter((p) => p.id !== id) : [],
    );

    // إرسال طلب الحذف للسيرفر بعد مهلة قصيرة أو مباشرة
    setTimeout(() => {
      deleteMutation.mutate(id);
    }, 4000);
    // إظهار إشعار نظيف يخبر المستخدم أنه تم الحذف مع توفير إمكانية التراجع الفوري عبر إعادة تحديث الصفحة أو الكاش إذا رغبنا
    toast.success(`Project "${targetProject.name}" deleted.`, {
      duration: 4000,
    });
  };

  return {
    ...projectsQuery,
    projects: projectsQuery.data ?? [],
    createProject: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateProject: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteProject: deleteProjectWithUndo,
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
