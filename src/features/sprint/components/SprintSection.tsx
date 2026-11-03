import type { Sprint, Todo, StartSprintRequest } from "../../../types/api";
import { useTranslation } from "../../../store/useAppStore";
import { BacklogSectionList } from "../../todos/BacklogSectionList";
import { SprintHeader } from "./SprintHeader";

interface SprintSectionProps {
  sprint: Sprint;
  todos: Todo[];
  allSprints: Sprint[];
  isCollapsed: boolean;
  onToggle: () => void;
  onEditSprint: (sprint: Sprint) => void;
  onDeleteSprint: (sprintId: string) => void;
  onStartSprint: (sprintId: string, data: StartSprintRequest) => Promise<void>;
  onSelectTodo: (todo: Todo) => void;
  onEditTodo: (todo: Todo) => void;
  onDeleteTodo: (todo: Todo) => void;
}

export function SprintSection({
  sprint,
  todos,
  allSprints,
  isCollapsed,
  onToggle,
  onEditSprint,
  onDeleteSprint,
  onStartSprint,
  onSelectTodo,
  onEditTodo,
  onDeleteTodo,
}: SprintSectionProps) {
  const { t } = useTranslation();
  const copy = t.projectsPage.backlogPage;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all duration-200 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <SprintHeader
        sprint={sprint}
        todos={todos}
        allSprints={allSprints}
        isCollapsed={isCollapsed}
        onToggle={onToggle}
        onEditSprint={onEditSprint}
        onDeleteSprint={onDeleteSprint}
        onStartSprint={onStartSprint}
      />

      {!isCollapsed && (
        <BacklogSectionList
          todos={todos}
          rawTotalCount={todos.length}
          moreLabel={copy.moreActions}
          noResultsText={copy.noResults}
          emptyStateText={copy.emptyState}
          onSelectTodo={onSelectTodo}
          onEditTodo={onEditTodo}
          onDeleteTodo={onDeleteTodo}
        />
      )}
    </section>
  );
}
