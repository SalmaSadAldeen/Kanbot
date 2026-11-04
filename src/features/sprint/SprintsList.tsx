import type { Sprint, Todo, StartSprintRequest } from "../../types/api";
import { SprintSection } from "./components/SprintSection";

interface SprintsListProps {
  sprints: Sprint[];
  allSprints: Sprint[];
  allTodos: Todo[];
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
  collapsedMap,
  onToggleSection,
  onEditSprint,
  onDeleteSprint,
  onStartSprint,
  onSelectTodo,
  onEditTodo,
}: SprintsListProps) {
  return (
    <div className="space-y-4">
      {sprints.map((sprint) => {
        const sprintTodos = allTodos.filter(
          (todo) => todo.sprintId === sprint.id,
        );

        return (
          <SprintSection
            key={sprint.id}
            sprint={sprint}
            todos={sprintTodos}
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
