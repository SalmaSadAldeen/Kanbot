import type { Todo, Sprint, StartSprintRequest } from "../../types/api";
import { SprintSection } from "./components/SprintSection";

interface SprintsListProps {
  sprints: Sprint[];
  allSprints: Sprint[];
  allTodos: Todo[];
  collapsedMap: Set<string>;
  onToggleSection: (sprintId: string) => void;
  onEditSprint: (sprint: Sprint) => void;
  onDeleteSprint: (sprintId: string) => void;
  onStartSprint: (sprintId: string, data: StartSprintRequest) => Promise<void>;
  onSelectTodo: (todo: Todo) => void;
  onEditTodo: (todo: Todo) => void;
  onDeleteTodo: (todo: Todo) => void;
}

export function SprintsList({
  sprints,
  allSprints,
  allTodos,
  collapsedMap,
  onToggleSection,
  onEditSprint,
  onDeleteSprint,
  onStartSprint,
  onSelectTodo,
  onEditTodo,
  onDeleteTodo,
}: SprintsListProps) {
  const plannedSprints = sprints.filter((s) => s.status === "planned");

  if (!plannedSprints.length) return null;

  return (
    <div className="space-y-6">
      {plannedSprints.map((sprint) => {
        const sprintTodos = allTodos.filter(
          (todo) => todo.sprintId === sprint.id,
        );

        return (
          <SprintSection
            key={sprint.id}
            sprint={sprint}
            allSprints={allSprints}
            todos={sprintTodos}
            isCollapsed={collapsedMap.has(sprint.id)}
            onToggle={() => onToggleSection(sprint.id)}
            onEditSprint={onEditSprint}
            onDeleteSprint={onDeleteSprint}
            onStartSprint={onStartSprint}
            onSelectTodo={onSelectTodo}
            onEditTodo={onEditTodo}
            onDeleteTodo={onDeleteTodo}
          />
        );
      })}
    </div>
  );
}
