import { useState, useRef, useEffect } from "react";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  ListTodo,
} from "lucide-react";
import { useTranslation } from "../../../store/useAppStore";

interface SprintMenuOption {
  id: string;
  name: string;
}

interface TodoActionsMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  onMoveToBacklog?: () => void;
  onMoveToTop?: () => void;
  onMoveToBottom?: () => void;
  onMoveToSprint?: (sprintId: string) => void;
  sprintOptions?: SprintMenuOption[];
  moreLabel: string;
}

export function TodoActionsMenu({
  onEdit,
  onDelete,
  onMoveToBacklog,
  onMoveToTop,
  onMoveToBottom,
  onMoveToSprint,
  sprintOptions = [],
  moreLabel,
}: TodoActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const dict = t.projectsPage.backlogPage.todoActions;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      // إذا كانت المساحة بالأسفل أقل من 280 بكسل، افتح القائمة للأعلى تلقائياً لتظهر كاملة
      setOpenUpward(spaceBelow < 280);
    }
    setIsOpen(!isOpen);
  };

  const hasMoveActions =
    Boolean(onMoveToBacklog) ||
    Boolean(onMoveToTop) ||
    Boolean(onMoveToBottom) ||
    sprintOptions.length > 0;

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        aria-label={moreLabel}
        title={moreLabel}
        onClick={handleToggle}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
      >
        <MoreHorizontal size={16} />
      </button>

      {isOpen && (
        <div
          className={`absolute end-0 z-50 w-52 origin-top-end rounded-xl bg-white p-1.5 shadow-2xl ring-1 ring-black/5 dark:bg-slate-900 dark:ring-white/10 dark:border dark:border-slate-800 animate-in fade-in zoom-in-95 duration-100 ${
            openUpward ? "bottom-full mb-2" : "top-full mt-1"
          }`}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              onEdit();
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Edit size={14} className="text-indigo-500" />
            <span>{dict.edit || "Edit"}</span>
          </button>

          {hasMoveActions && (
            <div className="my-1 border-t border-slate-200 pt-1 dark:border-slate-800">
              {onMoveToTop && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                    onMoveToTop();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <ArrowUp size={14} className="text-sky-500" />
                  <span>{"Move to top"}</span>
                </button>
              )}

              {onMoveToBottom && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                    onMoveToBottom();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <ArrowDown size={14} className="text-sky-500" />
                  <span>{"Move to bottom"}</span>
                </button>
              )}

              {onMoveToBacklog && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                    onMoveToBacklog();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <ListTodo size={14} className="text-emerald-500" />
                  <span>{"Move to backlog"}</span>
                </button>
              )}

              {sprintOptions.map((sprint) => (
                <button
                  key={sprint.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                    onMoveToSprint?.(sprint.id);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <span
                    className="h-2 w-2 rounded-full bg-violet-500"
                    aria-hidden="true"
                  />
                  <span>{`Move to ${sprint.name}`}</span>
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              onDelete();
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 transition-colors mt-0.5 cursor-pointer"
          >
            <Trash2 size={14} />
            <span>{dict.delete || "Delete"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
