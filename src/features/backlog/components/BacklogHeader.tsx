import { Search, Sparkles, Activity, Plus, ChevronDown } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { TODO_PRIORITIES, TODO_TYPES } from "../../../types/api";
import type { TodoPriority, TodoType } from "../../../types/api";

interface BacklogCopy {
  subtitle: string;
  title: string;
  todos: string;
  pts: string;
  askAi: string;
  search: string;
  allPriorities: string;
  priorityLabels: Record<TodoPriority, string>;
  allTypes: string;
  typeLabels: Record<TodoType, string>;
  generateTodos: string;
  planSprint: string;
  createSprint: string;
}

interface BacklogHeaderProps {
  copy: BacklogCopy;
  search: string;
  setSearch: (val: string) => void;
  priority: TodoPriority | "all";
  setPriority: (val: TodoPriority | "all") => void;
  type: TodoType | "all";
  setType: (val: TodoType | "all") => void;
  totalTodos: number;
  totalPoints: number;
}

export function BacklogHeader({
  copy,
  search,
  setSearch,
  priority,
  setPriority,
  type,
  setType,
  totalTodos,
  totalPoints,
}: BacklogHeaderProps) {
  return (
    <header className="space-y-4">
      {/* عنوان الصفحة والعدادات */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {copy.subtitle}
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            {copy.title}
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">
            {totalTodos} {copy.todos}
            <span className="mx-2 text-slate-300 dark:text-slate-700">·</span>
            {totalPoints} {copy.pts}
          </p>
        </div>
        <Button
          variant="outline"
          leftIcon={<Sparkles size={16} />}
          className="rounded-xl cursor-pointer"
        >
          {copy.askAi}
        </Button>
      </div>

      {/* شريط البحث والفلاتر */}
      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <label className="relative min-w-48 flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={copy.search}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 ps-9 pe-3 text-sm font-medium text-slate-900 dark:text-slate-100 outline-none transition focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800"
            />
          </label>

          {/* فلتر الأولويات */}
          <div className="relative">
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-auto">
                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value as TodoPriority | "all")
                  }
                  className="h-10 w-full sm:min-w-36 rounded-xl border border-slate-200 bg-slate-50 px-3 pr-8 text-sm font-medium text-slate-800 dark:text-slate-100 outline-none dark:border-slate-700 dark:bg-slate-800 appearance-none cursor-pointer"
                >
                  <option
                    value="all"
                    className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  >
                    {copy.allPriorities}
                  </option>
                  {TODO_PRIORITIES.map((item) => (
                    <option
                      key={item}
                      value={item}
                      className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                    >
                      {copy.priorityLabels[item]}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* فلتر الأنواع */}
          <div className="relative">
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-auto">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as TodoType | "all")}
                  className="h-10 w-full sm:min-w-32 rounded-xl border border-slate-200 bg-slate-50 px-3 pr-8 text-sm font-medium text-slate-800 dark:text-slate-100 outline-none dark:border-slate-700 dark:bg-slate-800 appearance-none cursor-pointer"
                >
                  <option
                    value="all"
                    className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  >
                    {copy.allTypes}
                  </option>
                  {TODO_TYPES.map((item) => (
                    <option
                      key={item}
                      value={item}
                      className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                    >
                      {copy.typeLabels[item]}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Sparkles size={14} />}
            className="cursor-pointer"
          >
            {copy.generateTodos}
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Activity size={14} />}
            className="cursor-pointer"
          >
            {copy.planSprint}
          </Button>
          <Button
            size="sm"
            leftIcon={<Plus size={15} />}
            className="cursor-pointer"
          >
            {copy.createSprint}
          </Button>
        </div>
      </div>
    </header>
  );
}
