import { useState, useCallback } from "react";
import { useParams, Link } from "react-router";
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
import { Kanban, ListTodo } from "lucide-react";

import { useProject } from "../../hooks/useProjects";
import { useBoard } from "../../hooks/useBoard";
import { useSprints } from "../../hooks/useSprints";
import { EmptyState } from "../../components/ui/EmptyState";
import { Spinner } from "../../components/ui/Spinner";
import { Button } from "../../components/ui/Button";
import { SprintHeader } from "./components/SprintHeader";
import { BoardColumn } from "./components/BoardColumn";
import { TodoCard } from "./components/TodoCard";
import { TodoDetailsDialog } from "../todos/TodoDetailsDialog";
import { CompleteSprintDialog } from "../sprint/components/CompleteSprintDialog";
import type { Todo, TodoStatus, CompleteSprintRequest } from "../../types/api";
import { TODO_STATUSES } from "../../types/api";
import { useTranslation } from "../../store/useAppStore";

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
  const { t } = useTranslation();
  const board = t.projectsPage.boardPage;

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
      if (
        draggedTodo.status === targetStatus &&
        columns[targetStatus].length === 0
      )
        return;

      const targetCol = columns[targetStatus];
      const position = targetCol.length;

      if (
        draggedTodo.status === targetStatus &&
        draggedTodo.order === position - 1
      )
        return;

      moveCard(draggedTodo.id, {
        status: targetStatus,
        position,
        sprintId: draggedTodo.sprintId ?? undefined,
      });
      return;
    }

    let targetCol: Todo[] | null = null;
    let targetColStatus: TodoStatus | null = null;
    let targetIndex = -1;

    for (const status of TODO_STATUSES) {
      const col = columns[status];
      const idx = col.findIndex((t) => t.id === overId);
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

    moveCard(draggedTodo.id, {
      status: targetColStatus,
      position,
      sprintId: draggedTodo.sprintId ?? undefined,
    });
  }

  // 7. Complete sprint confirmation handler
  const handleCompleteConfirm = async (
    targetSprintId: string | null,
    // _generateSummary: boolean,
  ) => {
    if (!sprint) return;
    try {
      const payload: CompleteSprintRequest = {
        moveUnfinishedTo: targetSprintId ?? "backlog",
      };
      await completeSprint.mutateAsync({
        sprintId: sprint.id,
        data: payload,
      });
      setIsCompleteModalOpen(false);
      void refetch();
    } catch (err) {
      console.error("Failed to complete sprint:", err);
    }
  };

  // ── Render states ──────────────────────────────────────────────────────────

  if (projectQuery.isLoading || (activeSprintId && isLoading)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
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
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
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
        onSummarize={() => {
          /* TODO Day 6: AI summary */
        }}
        onAskAi={() => {
          /* TODO Day 6: AI drawer */
        }}
        isCompleting={completeSprint.isPending}
      />

      {/* ── Columns area ─────────────────────────────────────────────────── */}
      <div className="min-h-0 flex-1 overflow-x-auto pb-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid min-w-[760px] grid-cols-4 gap-3 sm:gap-4">
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
          sprints={sprint ? [sprint] : []}
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
