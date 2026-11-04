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
import { EmptyState } from "../../components/ui/EmptyState";
import { Spinner } from "../../components/ui/Spinner";
import { Button } from "../../components/ui/Button";
import { SprintHeader } from "./components/SprintHeader";
import { BoardColumn } from "./components/BoardColumn";
import { TodoCard } from "./components/TodoCard";
import { TodoDetailsDialog } from "../todos/TodoDetailsDialog";
import type { Todo, TodoStatus } from "../../types/api";
import { TODO_STATUSES } from "../../types/api";
import { useTranslation } from "../../store/useAppStore";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Given the droppable id (which equals a TodoStatus string like "in_progress"),
 * returns the target status — or null if the id doesn't map to a known status.
 */
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

  // ── 1. Resolve active sprint from project stats ────────────────────────────
  const projectQuery = useProject(projectId ?? "");
  const activeSprint = projectQuery.data?.stats.activeSprint ?? null;

  // ── 2. Fetch the board layout ──────────────────────────────────────────────
  const { sprint, columns, isLoading, isError, error, refetch, moveCard, isMoving } =
    useBoard(activeSprint?.id);

  // ── 3. Local UI state ──────────────────────────────────────────────────────
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeDragTodo, setActiveDragTodo] = useState<Todo | null>(null);

  const openDetail = useCallback((todo: Todo) => {
    setSelectedTodo(todo);
    setIsDetailOpen(true);
  }, []);

  const closeDetail = useCallback(() => {
    setIsDetailOpen(false);
    setSelectedTodo(null);
  }, []);

  // ── 4. dnd-kit sensors ────────────────────────────────────────────────────
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // Require a 5px movement before starting drag (prevents mis-clicks)
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // ── 5. Drag handlers ──────────────────────────────────────────────────────
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

    // The "over" id is either a column id (TodoStatus) or another card's id
    const overId = String(over.id);
    const targetStatus = toStatus(overId);

    if (targetStatus) {
      // ── Dropped directly onto a column (empty or its header) ──────────────
      if (
        draggedTodo.status === targetStatus &&
        columns[targetStatus].length === 0
      ) {
        return; // no-op: already in this empty column
      }

      const targetCol = columns[targetStatus];
      const position = targetCol.length; // append to end

      if (
        draggedTodo.status === targetStatus &&
        draggedTodo.order === position - 1
      ) {
        return; // already last in its column
      }

      moveCard(draggedTodo.id, {
        status: targetStatus,
        position,
        // Stay in the same sprint
        sprintId: draggedTodo.sprintId ?? undefined,
      });
      return;
    }

    // ── Dropped onto another card ─────────────────────────────────────────
    // Determine which column the target card is in
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

    // Build the new position: if moving within the same column, account for
    // the card being removed from its original slot first.
    let position = targetIndex;
    if (
      draggedTodo.status === targetColStatus &&
      draggedTodo.order < targetIndex
    ) {
      // Card was above the target; after removal the target shifts up by 1
      position = targetIndex - 1;
    }

    if (
      draggedTodo.id === overId ||
      (draggedTodo.status === targetColStatus &&
        draggedTodo.order === position)
    ) {
      return; // no-op: same position
    }

    moveCard(draggedTodo.id, {
      status: targetColStatus,
      position,
      sprintId: draggedTodo.sprintId ?? undefined,
    });
  }

  // ── 6. Render states ───────────────────────────────────────────────────────

  // Project or board loading
  if (projectQuery.isLoading || (activeSprint && isLoading)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Error fetching board
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

  // No active sprint
  if (!activeSprint) {
    return (
      <EmptyState
        title={board.noActiveSprint}
        description={board.noActiveSprintDesc}
        icon={<Kanban size={40} className="text-indigo-500" />}
        action={
          <Link to={`/projects/${projectId ?? ""}/backlog`}>
            <Button
              variant="primary"
              leftIcon={<ListTodo size={16} />}
            >
              {board.goToBacklog}
            </Button>
          </Link>
        }
      />
    );
  }

  // Sprint loaded but board columns not yet available (should not happen in practice)
  if (!sprint || !columns) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // ── 7. Main board ──────────────────────────────────────────────────────────
  return (
    <div className="flex h-full flex-col">
      {/* Sprint header */}
      <SprintHeader
        sprint={sprint}
        onCompleteSprint={() => {
          // TODO (Day 5): open CompleteSprintDialog
        }}
        onSummarize={() => {
          // TODO (Day 6): trigger AI summary
        }}
        onAskAi={() => {
          // TODO (Day 6): open AI drawer
        }}
      />

      {/* Kanban columns — horizontal scroll on small screens */}
      <div className="flex-1 overflow-x-auto pb-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex min-w-[640px] gap-3 sm:gap-4">
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

          {/* Floating drag overlay — renders the card being dragged */}
          <DragOverlay dropAnimation={null}>
            {activeDragTodo ? (
              <div className="w-64 rotate-1 opacity-95">
                <TodoCard
                  todo={activeDragTodo}
                  onOpen={() => {/* overlay is non-interactive */}}
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
    </div>
  );
}
