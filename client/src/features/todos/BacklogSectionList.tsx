import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Todo } from "../../types/api";
import { TodoRow } from "../todos/TodoRow";

interface BacklogSectionListProps {
  todos: Todo[];
  rawTotalCount: number;
  moreLabel: string;
  noResultsText: string;
  emptyStateText: string;
  onSelectTodo: (todo: Todo) => void;
  onEditTodo: (todo: Todo) => void;
  sprintOptions?: { id: string; name: string }[];
  sprintId?: string | null;
  containerId?: string;
  isSelectMode?: boolean;
  selectedTodoIds?: string[];
  onToggleSelectTodo?: (id: string) => void;
}

export function BacklogSectionList({
  todos,
  rawTotalCount,
  moreLabel,
  noResultsText,
  emptyStateText,
  onSelectTodo,
  onEditTodo,
  sprintOptions = [],
  containerId = "backlog-container",
  isSelectMode = false,
  selectedTodoIds = [],
  onToggleSelectTodo,
}: BacklogSectionListProps) {
  const { setNodeRef } = useDroppable({
    id: containerId,
  });

  return (
    <div ref={setNodeRef} className="min-h-[50px] transition-colors">
      {todos.length > 0 ? (
        <SortableContext
          items={todos.map((t: Todo) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col bg-white dark:bg-slate-900 overflow-visible">
            {todos.map((todo: Todo, index: number) => (
              <div
                key={todo.id}
                className={`${
                  index > 0
                    ? "border-t border-slate-100 dark:border-slate-800/40"
                    : ""
                } overflow-visible`} // تأكيد عدم وجود قص للعناصر
              >
                <TodoRow
                  todo={todo}
                  moreLabel={moreLabel}
                  onSelect={() => onSelectTodo(todo)}
                  onEdit={() => onEditTodo(todo)}
                  sprintOptions={sprintOptions}
                  isSelectMode={isSelectMode}
                  isSelected={selectedTodoIds.includes(todo.id)}
                  onToggleSelect={onToggleSelectTodo}
                />
              </div>
            ))}
          </div>
        </SortableContext>
      ) : (
        <div className="px-6 py-12 text-center text-sm font-medium text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900">
          {rawTotalCount ? noResultsText : emptyStateText}
        </div>
      )}
    </div>
  );
}
