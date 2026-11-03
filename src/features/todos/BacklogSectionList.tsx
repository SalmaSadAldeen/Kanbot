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
  onDeleteTodo: (todo: Todo) => void;
}

export function BacklogSectionList({
  todos,
  rawTotalCount,
  moreLabel,
  noResultsText,
  emptyStateText,
  onSelectTodo,
  onEditTodo,
  onDeleteTodo,
}: BacklogSectionListProps) {
  return (
    <>
      {todos.length > 0 ? (
        // تم إزالة divide-y واستبداله بفواصل داخلية نظيفة ومستقرة لا تتأثر بإعادة الرندر أو الإضافة
        <div className="flex flex-col bg-white dark:bg-slate-900">
          {todos.map((todo: Todo, index: number) => (
            <div
              key={todo.id}
              className={
                index > 0
                  ? "border-t border-slate-100 dark:border-slate-800/40"
                  : ""
              }
            >
              <TodoRow
                todo={todo}
                moreLabel={moreLabel}
                onSelect={() => onSelectTodo(todo)}
                onEdit={() => onEditTodo(todo)}
                onDelete={(tItem) => onDeleteTodo(tItem)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="px-6 py-12 text-center text-sm font-medium text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900">
          {rawTotalCount ? noResultsText : emptyStateText}
        </div>
      )}
    </>
  );
}
