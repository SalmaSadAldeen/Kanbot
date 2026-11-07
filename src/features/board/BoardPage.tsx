import { useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Kanban, ListTodo, GripVertical, Keyboard } from "lucide-react";

import { useProject } from "../../hooks/useProjects";
import { useBoard } from "../../hooks/useBoard";
import { useSprints } from "../../hooks/useSprints";
import { EmptyState } from "../../components/ui/EmptyState";
import { Button } from "../../components/ui/Button";
import { SprintHeader } from "./components/SprintHeader";
import { BoardColumn } from "./components/BoardColumn";
import { TodoCard } from "./components/TodoCard";
import { TodoDetailsDialog } from "../todos/TodoDetailsDialog";
import { CompleteSprintDialog } from "../sprint/components/CompleteSprintDialog";
import type { Todo, TodoStatus, CompleteSprintRequest } from "../../types/api";
import { TODO_STATUSES } from "../../types/api";
import { useTranslation } from "../../store/useAppStore";
import { useAiUi } from "../../store/useAiUi";
import { useSprintSummary } from "../../hooks/useAi";
import toast from "react-hot-toast";

// ─────────────────────────────────────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────────────────────────────────────
function toStatus(droppableId: string): TodoStatus | null {
  return (TODO_STATUSES as readonly string[]).includes(droppableId)
    ? (droppableId as TodoStatus)
    : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Board Page
// ─────────────────────────────────────────────────────────────────────────────
export function BoardPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { t, isRtl } = useTranslation();
  const board = t.projectsPage.boardPage;
  const openSummary = useAiUi((s) => s.openSummary);
  const summarizeSprint = useSprintSummary();

  // 1. Resolve active sprint id from project stats
  const projectQuery = useProject(projectId ?? "");
  const activeSprintId = projectQuery.data?.stats.activeSprint?.id;

  // 2. Fetch sprints data and mutations (completeSprint, etc.)
  const { allSprints, completeSprint } = useSprints(projectId);

  // 3. Fetch the board layout for the active sprint
  const {
    sprint,
    columns,
    isLoading,
    isError,
    error,
    refetch,
    moveCard,
    isMoving,
  } = useBoard(activeSprintId);

  // 4. Local UI state
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeDragTodo, setActiveDragTodo] = useState<Todo | null>(null);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [dragAnnouncement, setDragAnnouncement] = useState("");

  // حالة لإظهار وإخفاء التوريال الخاص بالحركة والسحب
  const [showTutorial] = useState(true);

  const openDetail = useCallback((todo: Todo) => {
    setSelectedTodo(todo);
    setIsDetailOpen(true);
  }, []);

  const closeDetail = useCallback(() => {
    setIsDetailOpen(false);
    setSelectedTodo(null);
  }, []);

  // 5. dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // 6. Drag handlers
  function handleDragStart(event: DragStartEvent) {
    const todo = (event.active.data.current as { todo?: Todo })?.todo;
    setActiveDragTodo(todo ?? null);
    if (todo) setDragAnnouncement(`${todo.key} — ${board.dragPickedUp}`);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDragTodo(null);
    const { active, over } = event;
    if (!over || !columns) return;

    const draggedTodo = (active.data.current as { todo?: Todo })?.todo;
    if (!draggedTodo) return;

    const overId = String(over.id);
    const targetStatus = toStatus(overId);

    if (targetStatus) {
      const targetCol = columns[targetStatus];
      const position =
        targetCol.length - (draggedTodo.status === targetStatus ? 1 : 0);
      if (draggedTodo.status === targetStatus && draggedTodo.order === position)
        return;

      void moveCard(draggedTodo.id, {
        status: targetStatus,
        position,
        sprintId: draggedTodo.sprintId ?? undefined,
      });
      setDragAnnouncement(
        `${draggedTodo.key} ${board.dragMovedTo} ${board.columns[targetStatus]}`,
      );
      return;
    }

    let targetCol: Todo[] | null = null;
    let targetColStatus: TodoStatus | null = null;
    let targetIndex = -1;

    for (const status of TODO_STATUSES) {
      const col = columns[status];
      const idx = col.findIndex((item) => item.id === overId);
      if (idx !== -1) {
        targetCol = col;
        targetColStatus = status;
        targetIndex = idx;
        break;
      }
    }

    if (!targetCol || targetColStatus === null) return;

    let position = targetIndex;
    if (
      draggedTodo.status === targetColStatus &&
      draggedTodo.order < targetIndex
    ) {
      position = targetIndex - 1;
    }

    if (
      draggedTodo.id === overId ||
      (draggedTodo.status === targetColStatus && draggedTodo.order === position)
    )
      return;

    void moveCard(draggedTodo.id, {
      status: targetColStatus,
      position,
      sprintId: draggedTodo.sprintId ?? undefined,
    });
    setDragAnnouncement(
      `${draggedTodo.key} ${board.dragMovedTo} ${board.columns[targetColStatus]}`,
    );
  }

  // 7. Complete sprint confirmation handler
  const handleCompleteConfirm = async (
    targetSprintId: string | null,
    generateSummary: boolean,
  ) => {
    if (!sprint) return;
    const payload: CompleteSprintRequest = {
      moveUnfinishedTo: targetSprintId ?? "backlog",
    };
    await completeSprint.mutateAsync({
      sprintId: sprint.id,
      data: payload,
    });
    setIsCompleteModalOpen(false);
    void refetch();
    if (generateSummary) {
      try {
        await summarizeSprint.mutateAsync(sprint.id);
        toast.success(t.ai.summaryReady);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : t.ai.summaryFailed,
        );
      }
    }
    navigate(`/projects/${projectId}/sprints/${sprint.id}`);
  };

  // ── Render states ──────────────────────────────────────────────────────────

  if (projectQuery.isLoading || (activeSprintId && isLoading)) {
    return (
      <div
        className="grid min-h-[60vh] grid-cols-4 gap-6 overflow-hidden"
        aria-label={board.loading}
      >
        {TODO_STATUSES.map((status) => (
          <section
            key={status}
            className="min-w-[220px] animate-pulse rounded-xl bg-slate-100 p-3 dark:bg-slate-900"
          >
            <div className="mb-4 h-6 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
            {[0, 1, 2].map((n) => (
              <div
                key={n}
                className="mb-3 h-24 rounded-lg bg-slate-200 dark:bg-slate-800"
              />
            ))}
          </section>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <p className="font-semibold text-slate-700 dark:text-slate-300">
          {board.loadingError}
        </p>
        <p className="mt-1 text-sm text-slate-500">
          {error instanceof Error ? error.message : ""}
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => void refetch()}
        >
          {board.retry}
        </Button>
      </div>
    );
  }

  if (!activeSprintId) {
    return (
      <EmptyState
        title={board.noActiveSprint}
        description={board.noActiveSprintDesc}
        icon={<Kanban size={40} className="text-indigo-500" />}
        action={
          <Link to={`/projects/${projectId ?? ""}/backlog`}>
            <Button variant="primary" leftIcon={<ListTodo size={16} />}>
              {board.goToBacklog}
            </Button>
          </Link>
        }
      />
    );
  }

  if (!sprint || !columns) {
    return (
      <div role="status" className="p-8 text-center text-sm text-slate-500">
        {board.loading}
      </div>
    );
  }

  const plannedSprints = allSprints.filter(
    (s) => s.status === "planned" && s.id !== sprint.id,
  );

  // ── Main board ─────────────────────────────────────────────────────────────
  return (
    <div className="flex h-full flex-col">
      {/* Sprint header */}
      <SprintHeader
        sprint={sprint}
        onCompleteSprint={() => setIsCompleteModalOpen(true)}
        onSummarize={() => openSummary(sprint.id)}
        isCompleting={completeSprint.isPending}
      />

      {/* تعليمات وتوريال الحركة والسحب والإفلات مع مسافة واضحة ومريحة للأعلى والأسفل */}
      {showTutorial && (
        <div className="my-5 mb-8 flex items-center justify-between rounded-xl border border-indigo-200 bg-indigo-50/70 px-4 py-3 text-xs font-medium text-indigo-900 shadow-xs dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-200">
          <div className="flex items-center gap-2.5">
            <GripVertical
              size={16}
              className="shrink-0 text-indigo-600 dark:text-indigo-400"
            />
            <span>
              {isRtl
                ? "تلميح: اسحب وأفلت المهام لترتيبها، أو استخدم مفاتيح الأسهم (Space/Enter للإمساك وEscape للإلغاء) لسهولة الوصول."
                : "Tip: Drag & drop tasks to reorder, or use keyboard arrows (Space/Enter to lift, Escape to cancel) for accessibility."}
            </span>
          </div>

          <Keyboard
            size={15}
            className="ms-auto shrink-0 text-indigo-500 opacity-80"
          />
        </div>
      )}

      {/* ── Columns area ─────────────────────────────────────────────────── */}
      <div className="min-h-0 flex-1 overflow-x-auto pb-4">
        <div className="sr-only" aria-live="assertive" aria-atomic="true">
          {dragAnnouncement}
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {/* الفراغ بين الأعمدة */}
          <div className="grid min-w-[880px] grid-cols-4 gap-6 sm:gap-8">
            {TODO_STATUSES.map((status) => (
              <BoardColumn
                key={status}
                status={status}
                todos={columns[status]}
                onOpenTodo={openDetail}
                isMoving={isMoving}
              />
            ))}
          </div>

          {/* Floating ghost card rendered by dnd-kit during drag */}
          <DragOverlay dropAnimation={null}>
            {activeDragTodo ? (
              <div className="w-56 rotate-1 opacity-95 drop-shadow-2xl">
                <TodoCard
                  todo={activeDragTodo}
                  onOpen={() => {
                    /* overlay is non-interactive */
                  }}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Todo details side-panel */}
      {projectId && (
        <TodoDetailsDialog
          key={selectedTodo?.id ?? "closed"}
          todo={selectedTodo}
          projectId={projectId}
          isOpen={isDetailOpen}
          onClose={closeDetail}
          sprints={allSprints}
        />
      )}

      {/* Complete Sprint Modal */}
      {sprint && (
        <CompleteSprintDialog
          isOpen={isCompleteModalOpen}
          onClose={() => setIsCompleteModalOpen(false)}
          activeSprint={sprint}
          plannedSprints={plannedSprints}
          onConfirm={handleCompleteConfirm}
          isPending={completeSprint.isPending}
        />
      )}
    </div>
  );
}
