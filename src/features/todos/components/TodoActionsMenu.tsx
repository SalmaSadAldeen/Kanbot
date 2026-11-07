import { useState, useRef, useEffect } from "react";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  ListTodo,
  ChevronRight,
  Layers,
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
  const [showSprintsSubmenu, setShowSprintsSubmenu] = useState(false);
  const [menuStyle, setMenuStyle] = useState<{
    top?: number;
    bottom?: number;
    right?: number;
    left?: number;
  }>({});

  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { t, isRtl } = useTranslation();

  // ── إصلاح TypeScript عبر إعطاء نمط كامل آمن للمفاتيح ──
  const dict = t.projectsPage?.backlogPage?.todoActions as
    | Record<string, string>
    | undefined;
  const safeDict = {
    edit: dict?.edit ?? "Edit",
    delete: dict?.delete ?? "Delete",
    moveToTop: dict?.moveToTop ?? "Move to top",
    moveToBottom: dict?.moveToBottom ?? "Move to bottom",
    moveToBacklog: dict?.moveToBacklog ?? "Move to backlog",
    moveToSprint: dict?.moveToSprint ?? "Move to sprint...",
    selectSprint: dict?.selectSprint ?? "Select sprint",
    back: dict?.back ?? "Back",
  };

  // إغلاق القائمة عند النقر خارجها أو السكرول خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowSprintsSubmenu(false);
      }
    };

    const handleWindowScroll = (event: Event) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setShowSprintsSubmenu(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleWindowScroll, true);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleWindowScroll, true);
    };
  }, [isOpen]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const menuHeight = 260;

      const openUpward = spaceBelow < menuHeight && rect.top > menuHeight;

      if (openUpward) {
        setMenuStyle({
          bottom: window.innerHeight - rect.top + 4,
          [isRtl ? "left" : "right"]: isRtl
            ? rect.left
            : window.innerWidth - rect.right,
        });
      } else {
        setMenuStyle({
          top: rect.bottom + 4,
          [isRtl ? "left" : "right"]: isRtl
            ? rect.left
            : window.innerWidth - rect.right,
        });
      }
    }
    setIsOpen(!isOpen);
    setShowSprintsSubmenu(false);
  };

  const hasMoveActions =
    Boolean(onMoveToBacklog) ||
    Boolean(onMoveToTop) ||
    Boolean(onMoveToBottom) ||
    sprintOptions.length > 0;

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        ref={buttonRef}
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
          style={{
            position: "fixed",
            ...menuStyle,
          }}
          className="z-[99999] w-52 rounded-xl bg-white p-1.5 shadow-2xl ring-1 ring-black/5 dark:bg-slate-900 dark:ring-white/10 dark:border dark:border-slate-800 animate-in fade-in zoom-in-95 duration-100"
        >
          {/* القائمة الرئيسية */}
          {!showSprintsSubmenu ? (
            <div className="space-y-0.5">
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
                <span>{safeDict.edit}</span>
              </button>

              {hasMoveActions && (
                <div className="my-1 border-t border-slate-200 pt-1 dark:border-slate-800 space-y-0.5">
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
                      <span>{safeDict.moveToTop}</span>
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
                      <span>{safeDict.moveToBottom}</span>
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
                      <span>{safeDict.moveToBacklog}</span>
                    </button>
                  )}

                  {sprintOptions.length > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSprintsSubmenu(true);
                      }}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Layers size={14} className="text-violet-500" />
                        <span>{safeDict.moveToSprint}</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-400" />
                    </button>
                  )}
                </div>
              )}

              <div className="mt-1 border-t border-slate-200 pt-1 dark:border-slate-800">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                    onDelete();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span>{safeDict.delete}</span>
                </button>
              </div>
            </div>
          ) : (
            /* ── قائمة السبرنتات الفرعية ── */
            <div className="space-y-1">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 px-2 dark:border-slate-800">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSprintsSubmenu(false);
                  }}
                  className="text-[11px] font-bold text-indigo-600 hover:underline dark:text-indigo-400 cursor-pointer flex items-center gap-1"
                >
                  ← {safeDict.back}
                </button>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {safeDict.selectSprint}
                </span>
              </div>

              <div
                onWheel={(e) => e.stopPropagation()}
                className="max-h-52 overflow-y-auto pr-1 space-y-0.5 custom-scrollbar"
              >
                {sprintOptions.map((sprint) => (
                  <button
                    key={sprint.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOpen(false);
                      setShowSprintsSubmenu(false);
                      onMoveToSprint?.(sprint.id);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <span
                      className="h-2 w-2 rounded-full bg-violet-500 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="truncate">{sprint.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
