import { useState, type KeyboardEvent } from "react";
import { useParams, useNavigate } from "react-router";
import { Spinner } from "../../components/ui/Spinner";
import { useTranslation } from "../../store/useAppStore";
import type {
  Todo,
  Sprint,
  CreateSprintRequest,
  StartSprintRequest,
} from "../../types/api";
import { useBacklogMaster } from "../../hooks/useBacklogMaster";
import { useTodos } from "../../hooks/useTodos";
import { useSprints } from "../../hooks/useSprints";
import { BacklogHeader } from "./components/BacklogHeader";
import { SectionHeader } from "./components/SectionHeader";
import { BacklogSectionList } from "../todos/BacklogSectionList";
import { QuickCreateBar } from "./components/QuickCreateBar";
import { TodoDetailsDialog } from "../todos/TodoDetailsDialog";
import { SprintsList } from "../sprint/SprintsList";
import { SprintFormDialog } from "../sprint/components/SprintFormDialog";

export function BacklogPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const copy = t.projectsPage.backlogPage;

  const {
    backlogTodos,
    rawBacklogTodos,
    isLoading: isBacklogLoading,
    error: backlogError,
    refetchBacklog,
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

  const {
    sprints,
    allSprints,
    isLoading: isSprintsLoading,
    error: sprintsError,
    refetch: refetchSprints,
    createSprint,
    updateSprint,
    deleteSprint,
    startSprint,
  } = useSprints(projectId);

  const [quickTitle, setQuickTitle] = useState<string>("");
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);

  const [isSprintDialogOpen, setIsSprintDialogOpen] = useState(false);
  const [editingSprint, setEditingSprint] = useState<Sprint | null>(null);

  const totalPoints = rawBacklogTodos.reduce(
    (sum: number, todo: Todo) => sum + (todo.storyPoints ?? 0),
    0,
  );

  const backlogPoints = backlogTodos.reduce(
    (sum: number, todo: Todo) => sum + (todo.storyPoints ?? 0),
    0,
  );

  const handleSprintSubmit = async (data: CreateSprintRequest) => {
    try {
      if (editingSprint) {
        await updateSprint.mutateAsync({ sprintId: editingSprint.id, data });
      } else {
        await createSprint.mutateAsync(data);
      }
      setIsSprintDialogOpen(false);
      setEditingSprint(null);
    } catch (err) {
      console.error("Failed to save sprint:", err);
    }
  };

  const submitQuickCreate = async () => {
    const title = quickTitle.trim();
    if (!title || createTodo.isPending) return;
    try {
      await createTodo.mutateAsync({ title });
      setQuickTitle("");
    } catch {
      // Handled in mutation state
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

  const isLoading = isBacklogLoading || isSprintsLoading;
  const pageError = backlogError || sprintsError;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 pb-12">
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
        onCreateSprint={() => {
          setEditingSprint(null);
          setIsSprintDialogOpen(true);
        }}
      />

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
          className="rounded-2xl border border-rose-200 bg-rose-50/80 p-6 shadow-sm dark:border-rose-900/50 dark:bg-rose-950/20"
        >
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {copy.loadingError}
              </p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                {(pageError as Error).message}
              </p>
            </div>
            <button
              onClick={() => {
                void refetchBacklog();
                void refetchSprints();
              }}
              className="cursor-pointer rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-900/40"
            >
              {copy.retry}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <SprintsList
            sprints={sprints}
            allSprints={allSprints}
            allTodos={rawBacklogTodos}
            collapsedMap={collapsed}
            onToggleSection={toggleSection}
            onEditSprint={(s) => {
              setEditingSprint(s);
              setIsSprintDialogOpen(true);
            }}
            onDeleteSprint={(sprintId) =>
              void deleteSprint.mutateAsync(sprintId)
            }
            onStartSprint={async (
              sprintId: string,
              data: StartSprintRequest,
            ) => {
              await startSprint.mutateAsync({ sprintId, data });
              if (projectId) {
                navigate(`/projects/${projectId}/board`);
              }
            }}
            onSelectTodo={(todo) => {
              setSelectedTodo(todo);
              setIsDetailsOpen(true);
            }}
            onEditTodo={(todo) => {
              setSelectedTodo(todo);
              setIsDetailsOpen(true);
            }}
            onDeleteTodo={(todo) => void deleteTodo(todo.id)}
          />

          <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <SectionHeader
              title={copy.backlog}
              count={backlogTodos.length}
              points={backlogPoints}
              countLabel={copy.todos}
              pointsLabel={copy.pts}
              isCollapsed={collapsed.has("backlog")}
              onToggle={() => toggleSection("backlog")}
            />

            {!collapsed.has("backlog") && (
              <>
                <BacklogSectionList
                  todos={backlogTodos}
                  rawTotalCount={rawBacklogTodos.length}
                  moreLabel={copy.moreActions}
                  noResultsText={copy.noResults}
                  emptyStateText={copy.emptyState}
                  onSelectTodo={(todo) => {
                    setSelectedTodo(todo);
                    setIsDetailsOpen(true);
                  }}
                  onEditTodo={(todo) => {
                    setSelectedTodo(todo);
                    setIsDetailsOpen(true);
                  }}
                  onDeleteTodo={(todo) => {
                    void deleteTodo(todo.id);
                  }}
                />

                <QuickCreateBar
                  quickTitle={quickTitle}
                  setQuickTitle={setQuickTitle}
                  onQuickKeyDown={onQuickKeyDown}
                  isPending={createTodo.isPending}
                  isError={createTodo.isError}
                  errorMessage={(createTodo.error as Error)?.message}
                  placeholder={copy.quickCreatePlaceholder}
                  hintText={copy.quickCreateHint}
                />
              </>
            )}
          </section>
        </div>
      )}

      {/* مفاتيح دقيقة وفريدة لمنع تكرار مفتاح closed */}
      <SprintFormDialog
        key={
          isSprintDialogOpen
            ? (editingSprint?.id ?? "active-sprint-form")
            : "closed-sprint-form"
        }
        isOpen={isSprintDialogOpen}
        sprintToEdit={editingSprint}
        isPending={createSprint.isPending || updateSprint.isPending}
        error={createSprint.error || updateSprint.error}
        onClose={() => {
          setIsSprintDialogOpen(false);
          setEditingSprint(null);
        }}
        onSubmit={handleSprintSubmit}
      />

      {projectId && (
        <TodoDetailsDialog
          key={selectedTodo?.id ?? "closed-todo-details"}
          todo={selectedTodo}
          projectId={projectId}
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedTodo(null);
          }}
        />
      )}
    </div>
  );
}
