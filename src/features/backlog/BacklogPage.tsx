import { useState, type KeyboardEvent } from "react";
import { useParams, useNavigate } from "react-router";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import toast from "react-hot-toast";
import { Spinner } from "../../components/ui/Spinner";
import { useTranslation } from "../../store/useAppStore";
import type {
  Todo,
  Sprint,
  CreateSprintRequest,
  StartSprintRequest,
} from "../../types/api";
import { useBacklogMaster } from "../../hooks/useBacklogMaster";
import { useSprints } from "../../hooks/useSprints";
import { useTodos } from "../../hooks/useTodos";
import { BacklogHeader } from "./components/BacklogHeader";
import { SectionHeader } from "./components/SectionHeader";
import { BacklogSectionList } from "../todos/BacklogSectionList";
import { QuickCreateBar } from "./components/QuickCreateBar";
import { TodoDetailsDialog } from "../todos/TodoDetailsDialog";
import { SprintsList } from "../sprint/SprintsList";
import { SprintFormDialog } from "../sprint/components/SprintFormDialog";
import { useAiUi } from "../../store/useAiUi";
import { Button } from "../../components/ui/Button";

export function BacklogPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const copy = t.projectsPage.backlogPage;
  const openAiDialog = useAiUi((s) => s.openDialog);

  const { createTodo, isCreating } = useTodos(projectId, "backlog");
  const { moveTodo } = useTodos(projectId);

  const {
    backlogTodos,
    filteredTodos,
    rawBacklogTodos,
    isLoading: isBacklogLoading,
    error: backlogError,
    refetchBacklog,
    search,
    setSearch,
    priority,
    setPriority,
    type,
    setType,
    collapsed,
    toggleSection,
  } = useBacklogMaster(projectId);

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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const totalPoints = filteredTodos.reduce(
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
    if (!title || !projectId) return;
    try {
      await createTodo({
        title,
        sprintId: null,
        status: "todo",
        priority: "medium",
      });
      setQuickTitle("");
      await refetchBacklog();
    } catch (err) {
      console.error("Failed to create todo:", err);
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

  const handleGlobalDragEnd = async (event: DragEndEvent): Promise<void> => {
    const { active, over } = event;
    if (!over || !projectId) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeTodo = rawBacklogTodos.find((t) => t.id === activeId);
    if (!activeTodo) return;

    const { targetSprintId, computedIndex } = (() => {
      if (overId.startsWith("sprint-container-")) {
        const sprintId = overId.replace("sprint-container-", "");
        const sprintTodos = rawBacklogTodos.filter(
          (t) => (t.sprintId ?? null) === sprintId,
        );
        return { targetSprintId: sprintId, computedIndex: sprintTodos.length };
      }

      if (overId === "backlog-container") {
        return { targetSprintId: null, computedIndex: backlogTodos.length };
      }

      const overTodo = rawBacklogTodos.find((t) => t.id === overId);
      if (!overTodo) {
        return {
          targetSprintId: activeTodo.sprintId ?? null,
          computedIndex: 0,
        };
      }

      const sprintId = overTodo.sprintId ?? null;
      const targetList = rawBacklogTodos.filter(
        (t) => (t.sprintId ?? null) === sprintId,
      );
      const overIndex = targetList.findIndex((t) => t.id === overId);

      return {
        targetSprintId: sprintId,
        computedIndex: overIndex !== -1 ? overIndex : targetList.length,
      };
    })();

    const finalTargetList = rawBacklogTodos.filter(
      (t) => (t.sprintId ?? null) === targetSprintId,
    );
    const clampedPosition = Math.max(
      0,
      Math.min(computedIndex, finalTargetList.length),
    );

    if (activeTodo.sprintId === targetSprintId && activeId === overId) {
      return;
    }

    try {
      await moveTodo({
        todoId: activeId,
        data: {
          sprintId: targetSprintId,
          status: activeTodo.status,
          position: clampedPosition,
        },
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to move task";
      toast.error(message);
    }
  };

  const isLoading = isBacklogLoading || isSprintsLoading;
  const pageError = backlogError || sprintsError;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 pb-24">
      <BacklogHeader
        copy={copy}
        search={search}
        setSearch={setSearch}
        priority={priority}
        setPriority={setPriority}
        type={type}
        setType={setType}
        totalTodos={filteredTodos.length}
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(e) => {
            void handleGlobalDragEnd(e);
          }}
        >
          <div className="space-y-6">
            <SprintsList
              sprints={sprints}
              allSprints={allSprints}
              allTodos={rawBacklogTodos}
              visibleTodos={filteredTodos}
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
            />

            <section className="rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
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
                    containerId="backlog-container"
                    sprintId={null}
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
                    sprintOptions={allSprints.map((sprint) => ({
                      id: sprint.id,
                      name: sprint.name,
                    }))}
                  />

                  {/* تم تنسيق زر التوليد بالذكاء الاصطناعي وترتيب مكانه بدقة ضمن حاوية مرتبة */}
                  {rawBacklogTodos.length === 0 && (
                    <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-start">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openAiDialog("generate")}
                        className="gap-2"
                      >
                        {t.ai.generateWithAi}
                      </Button>
                    </div>
                  )}

                  <QuickCreateBar
                    quickTitle={quickTitle}
                    setQuickTitle={setQuickTitle}
                    onQuickKeyDown={onQuickKeyDown}
                    isPending={isCreating}
                    isError={false}
                    placeholder={copy.quickCreatePlaceholder}
                    hintText={copy.quickCreateHint}
                  />
                </>
              )}
            </section>
          </div>
        </DndContext>
      )}

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
          sprints={allSprints}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedTodo(null);
          }}
        />
      )}
    </div>
  );
}
