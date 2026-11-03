import { useState, useEffect, useRef } from "react";
import { RotateCcw } from "lucide-react";
import type { Todo } from "../../types/api";
import { useTranslation } from "../../store/useAppStore";
import { TypeIcon } from "./components/TypeIcon";
import { PriorityBadge } from "./components/PriorityBadge";
import { PointsSelect } from "./components/PointsSelect";
import { TodoActionsMenu } from "./components/TodoActionsMenu";

interface TodoRowProps {
  todo: Todo;
  moreLabel: string;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: (todo: Todo) => void;
}

export function TodoRow({
  todo,
  moreLabel,
  onSelect,
  onEdit,
  onDelete,
}: TodoRowProps) {
  const { t, isRtl } = useTranslation();

  const [isPendingDelete, setIsPendingDelete] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // عند النقر على حذف من القائمة، نبدأ الـ Timeout لمدة 4 ثوانٍ
  const handleDeleteClick = () => {
    setIsPendingDelete(true);

    timeoutRef.current = setTimeout(() => {
      onDelete(todo);
      setIsPendingDelete(false);
    }, 4000);
  };

  // إلغاء مؤقت الحذف وإعادة السطر لحالته الطبيعية
  const handleUndoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsPendingDelete(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      onClick={onSelect}
      className={`grid grid-cols-[1.5rem_minmax(4.5rem,auto)_minmax(8rem,1fr)_2rem_auto_auto_auto] items-center gap-3 px-4 py-2.5 transition-all duration-200 cursor-pointer outline-none focus:outline-none max-sm:grid-cols-[1.25rem_minmax(4rem,auto)_minmax(5rem,1fr)_auto] max-sm:gap-2 ${
        isPendingDelete
          ? "border-2 border-rose-400/80 bg-rose-50/60 dark:border-rose-900/60 dark:bg-rose-950/30"
          : "hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
      }`}
    >
      <span
        aria-hidden="true"
        className="cursor-grab select-none text-slate-300 dark:text-slate-600"
      >
        ⠿
      </span>
      <span className="font-mono text-[11px] font-semibold text-slate-500 dark:text-slate-400">
        {todo.key}
      </span>
      <span
        className="min-w-0 truncate text-sm font-medium text-slate-800 dark:text-slate-200"
        title={todo.title}
      >
        {todo.title}
      </span>
      <span className="flex justify-center">
        <TypeIcon type={todo.type} />
      </span>
      <span className="max-sm:hidden">
        <PriorityBadge priority={todo.priority} />
      </span>
      <span className="max-sm:hidden">
        <PointsSelect value={todo.storyPoints} disabled />
      </span>

      {/* منطقة الإجراءات: تتبدل لزر تراجع عند الانتظار */}
      <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
        {isPendingDelete ? (
          <button
            type="button"
            onClick={handleUndoClick}
            className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1 text-xs font-bold text-white shadow-xs transition hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 animate-pulse"
            title="تراجع عن الحذف"
          >
            <RotateCcw size={13} />
            <span>{isRtl ? "تراجع" : "Undo"}</span>
          </button>
        ) : (
          <TodoActionsMenu
            onEdit={onEdit}
            onDelete={handleDeleteClick}
            moreLabel={moreLabel}
          />
        )}
      </div>

      <span className="sr-only">{t.projectsPage.backlogPage.todoShort}</span>
    </div>
  );
}
