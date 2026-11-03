import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "../api/client";
import { getBacklogTodos } from "../api/backlog";
import { moveTodo } from "../api/todos";
import type {
  Sprint,
  Todo,
  CreateTodoRequest,
  MoveTodoRequest,
  TodoPriority,
  TodoType,
} from "../types/api";

export function useBacklogMaster(projectId: string | undefined) {
  const queryClient = useQueryClient();

  // States للفلترة والبحث
  const [search, setSearch] = useState<string>("");
  const [priority, setPriority] = useState<TodoPriority | "all">("all");
  const [type, setType] = useState<TodoType | "all">("all");
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set());

  // 1. جلب مهام الباكلوج
  const backlogQuery = useQuery<Todo[], Error>({
    queryKey: ["projects", projectId, "backlog-todos"],
    queryFn: () =>
      projectId ? getBacklogTodos(projectId) : Promise.resolve([]),
    enabled: Boolean(projectId),
  });

  // 2. جلب سبرنتات المشروع
  const sprintsQuery = useQuery<Sprint[], Error>({
    queryKey: ["projects", projectId, "sprints"],
    queryFn: async () => {
      if (!projectId) return [];
      const response = await request<{ sprints: Sprint[] }>(
        "GET",
        `/projects/${projectId}/sprints`,
      );
      return response.sprints;
    },
    enabled: Boolean(projectId),
  });

  // فلترة السبرنتات المخطط لها فقط (Planned Sprints)
  const plannedSprints = useMemo(() => {
    return (sprintsQuery.data ?? []).filter((s) => s.status === "planned");
  }, [sprintsQuery.data]);

  // 3. إضافة مهمة جديدة للباكلوج (Quick Create - BL-2)
  const createTodoMutation = useMutation({
    mutationFn: async (data: CreateTodoRequest) => {
      if (!projectId) throw new Error("A project must be selected.");
      const payload: CreateTodoRequest = {
        ...data,
        sprintId: null,
      };
      const response = await request<{ todo: Todo }>(
        "POST",
        `/projects/${projectId}/todos`,
        payload,
      );
      return response.todo;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["projects", projectId, "backlog-todos"],
      });
      void queryClient.invalidateQueries({ queryKey: ["projects", projectId] });
    },
  });

  // 4. نقل أو إعادة ترتيب المهام
  const moveTodoMutation = useMutation({
    mutationFn: ({ todoId, data }: { todoId: string; data: MoveTodoRequest }) =>
      moveTodo(todoId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["projects", projectId, "backlog-todos"],
      });
    },
  });

  // دالة الترتيب والفلترة الشاملة (BL-6)
  const filterAndSortTodos = (todos: Todo[]) => {
    const sorted = [...todos].sort((a, b) => a.order - b.order);
    const query = search.trim().toLocaleLowerCase();
    return sorted.filter((todo) => {
      const matchesSearch =
        !query ||
        `${todo.key} ${todo.title} ${todo.description ?? ""}`
          .toLocaleLowerCase()
          .includes(query);
      const matchesPriority = priority === "all" || todo.priority === priority;
      const matchesType = type === "all" || todo.type === type;
      return matchesSearch && matchesPriority && matchesType;
    });
  };

  const backlogTodos = useMemo(() => {
    return filterAndSortTodos(backlogQuery.data ?? []);
  }, [backlogQuery.data, search, priority, type]);

  const toggleSection = (sectionId: string) => {
    setCollapsed((current) => {
      const next = new Set(current);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  };

  return {
    backlogTodos,
    rawBacklogTodos: backlogQuery.data ?? [],
    sprints: plannedSprints,
    allSprints: sprintsQuery.data ?? [],
    isLoading: backlogQuery.isLoading || sprintsQuery.isLoading,
    error: backlogQuery.error || sprintsQuery.error,
    refetchBacklog: backlogQuery.refetch,
    refetchSprints: sprintsQuery.refetch,
    createTodo: createTodoMutation,
    moveTodo: moveTodoMutation,
    // فلترة وبحث
    search,
    setSearch,
    priority,
    setPriority,
    type,
    setType,
    collapsed,
    toggleSection,
  };
}
