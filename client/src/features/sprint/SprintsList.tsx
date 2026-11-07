import type { Sprint, Todo, StartSprintRequest } from "../../types/api";
import { SprintSection } from "./components/SprintSection";

interface SprintsListProps {
  sprints: Sprint[];
  allSprints: Sprint[];
  allTodos: Todo[];
  visibleTodos?: Todo[];
  collapsedMap: Set<string>;
  onToggleSection: (sectionId: string) => void;
  onEditSprint: (sprint: Sprint) => void;
  onDeleteSprint: (sprintId: string) => void;
  onStartSprint: (sprintId: string, data: StartSprintRequest) => Promise<void>;
  onSelectTodo: (todo: Todo) => void;
  onEditTodo: (todo: Todo) => void;
}

export function SprintsList({
  sprints,
  allSprints,
  allTodos,
  visibleTodos,
  collapsedMap,
  onToggleSection,
  onEditSprint,
  onDeleteSprint,
  onStartSprint,
  onSelectTodo,
  onEditTodo,
}: SprintsListProps) {
  const activeVisibleTodos = visibleTodos ?? allTodos;

  return (
    <div className="space-y-4">
      {sprints.map((sprint) => {
        const sprintTodos = activeVisibleTodos.filter(
          (todo) => todo.sprintId === sprint.id,
        );
        const rawSprintCount = allTodos.filter(
          (todo) => todo.sprintId === sprint.id,
        ).length;

        return (
          <SprintSection
            key={sprint.id}
            sprint={sprint}
            todos={sprintTodos}
            rawTotalCount={rawSprintCount}
            allSprints={allSprints}
            isCollapsed={collapsedMap.has(sprint.id)}
            onToggle={() => onToggleSection(sprint.id)}
            onEditSprint={onEditSprint}
            onDeleteSprint={onDeleteSprint}
            onStartSprint={onStartSprint}
            onSelectTodo={onSelectTodo}
            onEditTodo={onEditTodo}
          />
        );
      })}
    </div>
  );
}
