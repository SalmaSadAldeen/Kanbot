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

// 1. مفاتيح الكاش (Query Keys): ثوابت نستخدمها لتمييز الكاش الخاص بالمشاريع في TanStack Query
export const projectsKeys = {
  all: ["projects"] as const, // مفتاح لجلب كل المشاريع
  detail: (id: string) => ["projects", id] as const, // مفتاح لجلب مشروع معين بالـ ID
};

export function useProjects() {
  const queryClient = useQueryClient(); // أداة التحكم بالذاكرة المؤقتة (Cache)

  // 2. جلب جميع المشاريع (GET)
  const projectsQuery = useQuery({
    queryKey: projectsKeys.all, // اسم الكاش
    queryFn: listProjects, // الدالة التي تجلب البيانات من السيرفر
    staleTime: 1000 * 60 * 5, // حماية الكاش: تبقى البيانات صالحة ولا يتم إرسال طلب جديد لمدة 5 دقائق
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // 3. إنشاء مشروع جديد (POST / Mutation)
  const createMutation = useMutation({
    mutationFn: (data: CreateProjectRequest) => createProject(data),
    onSuccess: (newProject) => {
      // عند نجاح الإنشاء، نحدث الكاش محلياً فوراً بإضافة المشروع الجديد للقائمة بدون طلب سيرفر جديد
      queryClient.setQueryData<ProjectWithStats[]>(
        projectsKeys.all,
        (old = []) => [...old, newProject],
      );
      toast.success("Project created successfully");
    },
    onError: (err: unknown) => {
      const message =
        err instanceof ApiError ? err.message : "Failed to create project";
      toast.error(message);
    },
  });

  // 4. تعديل مشروع (PATCH / Mutation)
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectRequest }) =>
      updateProject(id, data),
    onSuccess: (updatedProject, variables) => {
      // نحدث القائمة العامة محلياً
      queryClient.setQueryData<ProjectWithStats[]>(
        projectsKeys.all,
        (old = []) =>
          old.map((p) => (p.id === variables.id ? updatedProject : p)),
      );
      // ونحدث كاش تفاصيل المشروع المخصص أيضاً
      queryClient.setQueryData(
        projectsKeys.detail(variables.id),
        updatedProject,
      );
      toast.success("Project updated successfully");
    },
    onError: (err: unknown) => {
      const message =
        err instanceof ApiError ? err.message : "Failed to update project";
      toast.error(message);
    },
  });

  // 5. عملية الحذف الأساسية (DELETE API)
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProjectApi(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: projectsKeys.all });
      const previousProjects = queryClient.getQueryData<ProjectWithStats[]>(projectsKeys.all);
      queryClient.setQueryData<ProjectWithStats[]>(projectsKeys.all, (old = []) => old.filter((project) => project.id !== id));
      return { previousProjects };
    },
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: projectsKeys.detail(id) });
      toast.success("Project deleted successfully");
    },
    onError: (err: unknown, _id, context) => {
      if (context?.previousProjects) queryClient.setQueryData(projectsKeys.all, context.previousProjects);
      const message =
        err instanceof ApiError ? err.message : "Failed to delete project";
      toast.error(message);
    },
  });

  return {
    ...projectsQuery, // تنشر خصائص الـ query مثل isLoading, error, refetch
    projects: projectsQuery.data ?? [], // مصفوفة المشاريع (إذا كانت فارغة ترجع [] لكي لا يحدث Crash)
    createProject: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateProject: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteProject: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}

// هوك منفصل لجلب تفاصيل مشروع واحد بالـ ID
export function useProject(id: string) {
  return useQuery({
    queryKey: projectsKeys.detail(id),
    queryFn: () => getProject(id),
    enabled: !!id, // لا يتم تنفيذ الطلب إلا إذا كان الـ id موجوداً حقاً
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
