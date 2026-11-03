import { useState, useEffect } from "react";
import { Search, ListFilter } from "lucide-react";
import { TODO_PRIORITIES, TODO_TYPES } from "../../../types/api";
import type { TodoPriority, TodoType } from "../../../types/api";
import { useTranslation } from "../../../store/useAppStore";

type BacklogCopy = ReturnType<
  typeof useTranslation
>["t"]["projectsPage"]["backlogPage"];

interface BacklogFiltersProps {
  copy: BacklogCopy;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  priority: TodoPriority | "all";
  setPriority: (val: TodoPriority | "all") => void;
  type: TodoType | "all";
  setType: (val: TodoType | "all") => void;
}

export function BacklogFilters({
  copy,
  searchQuery,
  onSearchChange,
  priority,
  setPriority,
  type,
  setType,
}: BacklogFiltersProps) {
  const [localSearch, setLocalSearch] = useState<string>(searchQuery);

  // تطبيق الـ Debounce (تأخير 300ms) لتلبية متطلب BL-6 بدقة
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  return (
    <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
      <label className="relative min-w-48 flex-1">
        <Search
          size={16}
          className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder={copy.search}
          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 ps-10 pe-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 dark:focus:bg-slate-800"
        />
      </label>
      <label className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <ListFilter size={15} className="text-slate-400" />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as TodoPriority | "all")}
          className="h-10 min-w-36 rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200"
        >
          <option value="all">{copy.allPriorities}</option>
          {TODO_PRIORITIES.map((item) => (
            <option key={item} value={item}>
              {copy.priorityLabels[item]}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as TodoType | "all")}
          className="h-10 min-w-32 rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200"
        >
          <option value="all">{copy.allTypes}</option>
          {TODO_TYPES.map((item) => (
            <option key={item} value={item}>
              {copy.typeLabels[item]}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
