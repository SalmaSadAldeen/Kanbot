import { Search, Sparkles, Activity, Plus, ChevronDown } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { TODO_PRIORITIES, TODO_TYPES } from "../../../types/api";
import type { TodoPriority, TodoType } from "../../../types/api";
import { useAiUi } from "../../../store/useAiUi";

interface BacklogCopy {
  subtitle: string;
  title: string;
  todos: string;
  pts: string;
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
  onCreateSprint: () => void;
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
  onCreateSprint,
}: BacklogHeaderProps) {
  const openAiDialog = useAiUi((s) => s.openDialog);
  return (
    <header className="space-y-5">
      {/* ── العنوان العلوي مع لمسة جمالية متدرجة ── */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200/80 pb-6 dark:border-slate-800/80">
        <div className="min-w-0 space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
            {copy.subtitle}
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            {copy.title}
          </h1>
          <div className="flex items-center gap-2 pt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {totalTodos} {copy.todos}
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {totalPoints} {copy.pts}
            </span>
          </div>
        </div>

      </div>

      {/* ── شريط البحث والفلاتر الفاخر ── */}
      <div className="space-y-3.5 rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/90 backdrop-blur-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          {/* صندوق البحث */}
          <label className="relative min-w-48 flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={copy.search}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 ps-10 pe-4 text-xs font-semibold text-slate-900 outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-800"
            />
          </label>

          {/* فلاتر الأولويات والأنواع */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative w-full sm:w-auto">
              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as TodoPriority | "all")
                }
                className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 pr-9 text-xs font-bold text-slate-700 outline-none transition-all duration-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 sm:min-w-38"
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
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>

            <div className="relative w-full sm:w-auto">
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TodoType | "all")}
                className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 pr-9 text-xs font-bold text-slate-700 outline-none transition-all duration-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 sm:min-w-36"
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
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* ── أزرار العمليات السفلية مع ربط زر إنشاء السبرنت ── */}
        <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3.5 dark:border-slate-800/80">
          <Button
            onClick={() => openAiDialog("generate")}
            variant="outline"
            size="sm"
            leftIcon={<Sparkles size={13} className="text-indigo-500" />}
            className="rounded-xl border-slate-200 bg-slate-50/50 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer shadow-2xs transition-all"
          >
            {copy.generateTodos}
          </Button>
          <Button
            onClick={() => openAiDialog("plan")}
            variant="outline"
            size="sm"
            leftIcon={<Activity size={13} className="text-amber-500" />}
            className="rounded-xl border-slate-200 bg-slate-50/50 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer shadow-2xs transition-all"
          >
            {copy.planSprint}
          </Button>
          <Button
            size="sm"
            onClick={onCreateSprint}
            leftIcon={<Plus size={14} />}
            className="rounded-xl bg-indigo-600 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 dark:bg-indigo-600 dark:hover:bg-indigo-500 cursor-pointer transition-all"
          >
            {copy.createSprint}
          </Button>
        </div>
      </div>
    </header>
  );
}
