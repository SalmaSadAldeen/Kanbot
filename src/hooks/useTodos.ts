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
  Todo,
} from "../types/api";
import toast from "react-hot-toast";
import React from "react";

/** هوك جلب تفاصيل مهمة مفردة بالـ ID */
export function useTodoDetails(todoId: string | undefined) {
  return useQuery({
    queryKey: ["todo", todoId],
    queryFn: () => getTodoById(todoId!),
    enabled: Boolean(todoId),
  });
}

/** الهوك الشامل للـ CRUD الكامل لمهام المشروع مع ميزة التراجع (Undo) للحذف */
export function useTodos(projectId: string | undefined, sprintId?: string) {
  const queryClient = useQueryClient();

  // 📥 جلب المهام
  const todosQuery = useQuery({
    queryKey: ["projects", projectId, "todos", sprintId ?? "all"],
    queryFn: () =>
      projectId ? getProjectTodos(projectId, sprintId) : Promise.resolve([]),
    enabled: Boolean(projectId),
  });

  // ➕ إنشاء مهمة جديدة
  const createMutation = useMutation({
    mutationFn: (data: CreateTodoRequest) => {
      if (!projectId) throw new Error("Project ID is required");
      return createTodo(projectId, data);
    },
    onSuccess: () => {
      toast.success("Todo created successfully");
      void queryClient.invalidateQueries({ queryKey: ["projects", projectId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create todo");
    },
  });

  // ✏️ تعديل مهمة (PATCH)
  const updateMutation = useMutation({
    mutationFn: ({
      todoId,
      data,
    }: {
      todoId: string;
      data: UpdateTodoRequest;
    }) => updateTodo(todoId, data),
    onSuccess: (updatedTodo) => {
      toast.success("Todo updated successfully");
      void queryClient.invalidateQueries({ queryKey: ["projects", projectId] });
      queryClient.setQueryData(["todo", updatedTodo.id], updatedTodo);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update todo");
    },
  });

  // 🗑️ حذف مهمة (DELETE) مع دعم التراجع (Undo)
  const deleteMutation = useMutation({
    mutationFn: (todoId: string) => deleteTodo(todoId),
    onSuccess: (_, deletedTodoId) => {
      // حفظ النسخة المؤقتة لإمكانية إرجاعها عند النقر على زر Undo
      const previousTodos = queryClient.getQueryData<Todo[]>([
        "projects",
        projectId,
        "todos",
        sprintId ?? "all",
      ]);

      toast(
        (t) =>
          React.createElement(
            "div",
            { className: "flex items-center gap-3" },
            React.createElement("span", null, "Todo deleted successfully"),
            React.createElement(
              "button",
              {
                className:
                  "rounded-lg bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors",
                onClick: async () => {
                  toast.dismiss(t.id);
                  if (previousTodos) {
                    const todoToRestore = previousTodos.find(
                      (item) => item.id === deletedTodoId,
                    );
                    if (todoToRestore && projectId) {
                      try {
                        await createTodo(projectId, {
                          title: todoToRestore.title,
                          description: todoToRestore.description,
                          priority: todoToRestore.priority,
                          type: todoToRestore.type,
                          storyPoints: todoToRestore.storyPoints,
                          sprintId: todoToRestore.sprintId,
                        });
                        void queryClient.invalidateQueries({
                          queryKey: ["projects", projectId],
                        });
                        toast.success("Todo restored successfully");
                      } catch {
                        toast.error("Failed to restore todo");
                      }
                    }
                  }
                },
              },
              "Undo",
            ),
          ),
        { duration: 5000 },
      );

      void queryClient.invalidateQueries({ queryKey: ["projects", projectId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete todo");
    },
  });

  // 🔄 نقل أو إعادة ترتيب مهمة (Move)
  const moveMutation = useMutation({
    mutationFn: ({ todoId, data }: { todoId: string; data: MoveTodoRequest }) =>
      moveTodo(todoId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["projects", projectId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to move todo");
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
