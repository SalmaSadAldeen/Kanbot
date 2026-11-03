import { useState, type KeyboardEvent } from "react";
import { useParams } from "react-router";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { Spinner } from "../../components/ui/Spinner";
import { useTranslation } from "../../store/useAppStore";
import type { Todo } from "../../types/api";
import { useBacklogMaster } from "../../hooks/useBacklogMaster";
import { useTodos } from "../../hooks/useTodos";
import { BacklogHeader } from "./components/BacklogHeader";
import { TodoDetailsDialog } from "../todos/TodoDetailsDialog";
import { TodoRow } from "../todos/TodoRow";

export function BacklogPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { t } = useTranslation();
  const copy = t.projectsPage.backlogPage;

  const {
    backlogTodos,
    rawBacklogTodos,
    isLoading,
    error: pageError,
    refetchBacklog,
    refetchSprints,
    createTodo,
    search,
    setSearch,
    priority,
    setPriority,
    type,
    setType,
    collapsed,
    toggleSection,
  } = useBacklogMaster(projectId);

  const { deleteTodo } = useTodos(projectId);

  const [quickTitle, setQuickTitle] = useState<string>("");
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);

  const totalPoints = rawBacklogTodos.reduce(
    (sum: number, todo: Todo) => sum + (todo.storyPoints ?? 0),
    0,
  );

  const submitQuickCreate = async () => {
    const title = quickTitle.trim();
    if (!title || createTodo.isPending) return;
    try {
      await createTodo.mutateAsync({ title });
      setQuickTitle("");
    } catch {
      // Handled via createTodo.isError
    }
  };

  const onQuickKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      void submitQuickCreate();
    } else if (event.key === "Escape") {
      setQuickTitle("");
      event.currentTarget.blur();
    }
  };

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 pb-12 outline-none focus:outline-none">
      {/* الهيدر العلوي */}
      <BacklogHeader
        copy={copy}
        search={search}
        setSearch={setSearch}
        priority={priority}
        setPriority={setPriority}
        type={type}
        setType={setType}
        totalTodos={rawBacklogTodos.length}
        totalPoints={totalPoints}
      />

      {/* حالات التحميل والأخطاء */}
      {isLoading ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 text-sm text-slate-500">
          <Spinner size="lg" className="text-indigo-600" />
          <span className="font-medium animate-pulse">
            {t.projectsPage.loading}
          </span>
        </div>
      ) : pageError ? (
        <div
          role="alert"
          className="rounded-2xl border border-rose-200 bg-rose-50/80 p-6 dark:border-rose-900/50 dark:bg-rose-950/20 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {copy.loadingError}
              </p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                {pageError.message}
              </p>
            </div>
            <button
              onClick={() => {
                void refetchBacklog();
                void refetchSprints();
              }}
              className="rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-900/40 cursor-pointer"
            >
              {copy.retry}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {/* عنوان قسم الباكلوج مع زر الطي */}
            <SectionHeader
              title={copy.backlog}
              count={backlogTodos.length}
              points={backlogTodos.reduce(
                (sum: number, todo: Todo) => sum + (todo.storyPoints ?? 0),
                0,
              )}
              countLabel={copy.todos}
              pointsLabel={copy.pts}
              isCollapsed={collapsed.has("backlog")}
              onToggle={() => toggleSection("backlog")}
            />

            {!collapsed.has("backlog") && (
              <div className="flex flex-col bg-white dark:bg-slate-900">
                {backlogTodos.length > 0 ? (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {backlogTodos.map((todo: Todo) => (
                      <TodoRow
                        key={todo.id}
                        todo={todo}
                        moreLabel={copy.moreActions}
                        onSelect={() => {
                          setSelectedTodo(todo);
                          setIsDetailsOpen(true);
                        }}
                        onEdit={() => {
                          setSelectedTodo(todo);
                          setIsDetailsOpen(true);
                        }}
                        onDelete={(tItem) => {
                          void deleteTodo(tItem.id);
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-12 text-center text-sm font-medium text-slate-400 dark:text-slate-500">
                    {rawBacklogTodos.length ? copy.noResults : copy.emptyState}
                  </div>
                )}

                {/* شريط الإضافة السريعة معزول تماماً لمنع ظهور أي بوردير أسود */}
                <div className="border-t border-slate-100 bg-slate-50/60 p-3.5 dark:border-slate-800/80 dark:bg-slate-950/50">
                  <div className="flex items-center gap-3 px-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 shrink-0">
                      <Plus size={16} />
                    </div>
                    <input
                      value={quickTitle}
                      onChange={(event) => setQuickTitle(event.target.value)}
                      onKeyDown={onQuickKeyDown}
                      maxLength={200}
                      placeholder={copy.quickCreatePlaceholder}
                      aria-label={copy.quickCreatePlaceholder}
                      disabled={createTodo.isPending}
                      className="h-10 min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 disabled:opacity-60 dark:text-slate-100"
                    />
                    {createTodo.isPending && (
                      <Spinner size="sm" inline className="text-indigo-600" />
                    )}
                  </div>
                  <p className="ms-10 mt-1 text-[11px] font-medium text-slate-400">
                    {createTodo.isError
                      ? (createTodo.error as Error).message
                      : copy.quickCreateHint}
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      {/* نافذة تفاصيل المهمة الجانبية */}
      {projectId && (
        <TodoDetailsDialog
          key={selectedTodo?.id ?? "closed"}
          todo={selectedTodo}
          projectId={projectId}
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedTodo(null);
          }}
        />
      )}
    </main>
  );
}

interface SectionHeaderProps {
  title: string;
  count: number;
  points: number;
  countLabel: string;
  pointsLabel: string;
  isCollapsed: boolean;
  onToggle: () => void;
}

function SectionHeader({
  title,
  count,
  points,
  countLabel,
  pointsLabel,
  isCollapsed,
  onToggle,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 px-4 py-3 border-b border-slate-200/80 dark:bg-slate-900/80 dark:border-slate-800">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={!isCollapsed}
        className="flex min-w-0 flex-1 items-center gap-2.5 text-start group cursor-pointer outline-none focus:outline-none"
      >
        <span className="text-slate-400 transition-transform group-hover:text-slate-600 dark:group-hover:text-slate-200">
          {isCollapsed ? <ChevronRight size={17} /> : <ChevronDown size={17} />}
        </span>
        <span className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
          {title}
        </span>
        <span className="shrink-0 rounded-full bg-slate-200/70 px-2.5 py-0.5 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {count} {countLabel} · {points} {pointsLabel}
        </span>
      </button>
    </div>
  );
}
