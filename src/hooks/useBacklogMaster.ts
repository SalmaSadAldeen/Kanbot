import { useState, useMemo, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProjectTodos } from "../api/todos";
import type { Sprint, Todo, TodoPriority, TodoType } from "../types/api";
import { getProjectSprints } from "../api/sprints";
export function useBacklogMaster(projectId: string | undefined) {
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [priority, setPriority] = useState<TodoPriority | "all">("all");
  const [type, setType] = useState<TodoType | "all">("all");
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // 1. جلب جميع مهام المشروع (ليشمل مهام الباكلوغ ومهام السبرنتات معاً)
  const todosQuery = useQuery<Todo[], Error>({
    queryKey: ["projects", projectId, "todos", "all"],
    queryFn: () =>
      projectId ? getProjectTodos(projectId) : Promise.resolve([]),
    enabled: Boolean(projectId),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const sprintsQuery = useQuery<Sprint[], Error>({
    queryKey: ["projects", projectId, "sprints"],
    queryFn: () => {
      if (!projectId) return Promise.resolve([]);
      return getProjectSprints(projectId);
    },
    enabled: Boolean(projectId),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const plannedSprints = useMemo(() => {
    return (sprintsQuery.data ?? []).filter((s) => s.status === "planned");
  }, [sprintsQuery.data]);

  // استخراج مهام الباكلوغ فقط (التي لا تنتمي لأي سبرنت: sprintId === null)
  const pureBacklogTodos = useMemo(() => {
    const all = todosQuery.data ?? [];
    return all.filter((todo) => todo.sprintId === null);
  }, [todosQuery.data]);

  const filterAndSortTodos = useCallback((todos: Todo[]) => {
    const sorted = [...todos].sort((a, b) => a.order - b.order);
    const query = debouncedSearch.trim().toLocaleLowerCase();
    return sorted.filter((todo) => {
      const matchesSearch =
        !query ||
        `${todo.key} ${todo.title} ${todo.description ?? ""} ${todo.labels.join(" ")}`
          .toLocaleLowerCase()
          .includes(query);
      const matchesPriority = priority === "all" || todo.priority === priority;
      const matchesType = type === "all" || todo.type === type;
      return matchesSearch && matchesPriority && matchesType;
    });
  }, [debouncedSearch, priority, type]);

  // المهام المعروضة في قسم الباكلوغ بعد الفلترة والبحث
  const backlogTodos = useMemo(() => {
    return filterAndSortTodos(pureBacklogTodos);
  }, [pureBacklogTodos, filterAndSortTodos]);

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
    rawBacklogTodos: todosQuery.data ?? [], // تحتوي على كل مهام المشروع لتعمل السبرنتات بشكل صحيح
    sprints: plannedSprints,
    allSprints: sprintsQuery.data ?? [],
    isLoading: todosQuery.isLoading || sprintsQuery.isLoading,
    error: todosQuery.error || sprintsQuery.error,
    refetchBacklog: todosQuery.refetch,
    refetchSprints: sprintsQuery.refetch,
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
