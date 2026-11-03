import { useState } from "react";
import {
  X,
  Calendar,
  Clock,
  CheckCircle2,
  Tag,
  Layers,
  Flame,
  ChevronDown,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import type {
  Todo,
  TodoPriority,
  TodoType,
  StoryPoints,
  TodoStatus,
} from "../../types/api";
import { TODO_PRIORITIES, TODO_TYPES, STORY_POINTS } from "../../types/api";
import { useTodos } from "../../hooks/useTodos";
import { useTranslation } from "../../store/useAppStore";

interface TodoDetailsDialogProps {
  todo: Todo | null;
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function TodoDetailsDialog({
  todo,
  projectId,
  isOpen,
  onClose,
}: TodoDetailsDialogProps) {
  const { t } = useTranslation();
  const dict = t.projectsPage.todoDetails;

  const { updateTodo, isUpdating } = useTodos(projectId);

  const [title, setTitle] = useState<string>(() => todo?.title ?? "");
  const [description, setDescription] = useState<string>(
    () => todo?.description ?? "",
  );
  const [priority, setPriority] = useState<TodoPriority>(
    () => todo?.priority ?? "medium",
  );
  const [type, setType] = useState<TodoType>(() => todo?.type ?? "task");
  const [storyPoints, setStoryPoints] = useState<StoryPoints | null>(
    () => todo?.storyPoints ?? null,
  );
  const [status, setStatus] = useState<TodoStatus>(
    () => todo?.status ?? "todo",
  );
  const [dueDate, setDueDate] = useState<string>(() => todo?.dueDate ?? "");

  if (!isOpen || !todo) return null;

  const handleSave = async () => {
    await updateTodo({
      todoId: todo.id,
      data: {
        title,
        description,
        priority,
        type,
        storyPoints,
        status,
        dueDate: dueDate || null,
      },
    });
    onClose();
  };

  return (
    <>
      {/* Scoped keyframes */}
      <style>{`
        @keyframes detailsFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes detailsSlideIn {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm"
        style={{ animation: "detailsFadeIn 0.2s ease" }}
      >
        {/* Panel */}
        <div
          className="relative flex h-full w-full max-w-xl flex-col overflow-hidden border-s border-slate-200/80 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
          style={{
            animation: "detailsSlideIn 0.25s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {/* ── Header ── */}
          <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50/90 via-white to-white px-8 py-5 dark:border-slate-800 dark:from-slate-900/90 dark:via-slate-900 dark:to-slate-900">
            <div className="flex items-center gap-3">
              <span className="flex h-8 items-center justify-center rounded-xl bg-indigo-600/10 px-3 font-mono text-xs font-bold text-indigo-600 ring-1 ring-indigo-500/20 dark:bg-indigo-500/20 dark:text-indigo-400">
                {todo.key}
              </span>
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  {dict.editTask}
                </h2>
                <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                  Manage task properties &amp; workflow
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* ── Body ── */}
          <div className="flex-1 space-y-5 overflow-y-auto px-8 py-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {dict.title}
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-800"
              />
            </div>

            {/* Priority / Type / Points */}
            <div className="grid grid-cols-3 gap-3">
              {/* Priority */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <Flame size={11} className="text-amber-500" /> {dict.priority}
                </label>
                <div className="relative">
                  <select
                    value={priority}
                    onChange={(e) =>
                      setPriority(e.target.value as TodoPriority)
                    }
                    className="h-10 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-3 pr-8 text-xs font-bold capitalize text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    {TODO_PRIORITIES.map((p) => (
                      <option key={p} value={p}>
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={13}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

              {/* Type */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <Layers size={11} className="text-indigo-500" /> {dict.type}
                </label>
                <div className="relative">
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as TodoType)}
                    className="h-10 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-3 pr-8 text-xs font-bold capitalize text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    {TODO_TYPES.map((tp) => (
                      <option key={tp} value={tp}>
                        {tp.charAt(0).toUpperCase() + tp.slice(1)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={13}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

              {/* Points */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <Tag size={11} className="text-emerald-500" /> {dict.points}
                </label>
                <div className="relative">
                  <select
                    value={storyPoints ?? ""}
                    onChange={(e) =>
                      setStoryPoints(
                        e.target.value === ""
                          ? null
                          : (Number(e.target.value) as StoryPoints),
                      )
                    }
                    className="h-10 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-3 pr-8 text-xs font-bold text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    <option value="">{dict.none}</option>
                    {STORY_POINTS.map((sp) => (
                      <option key={sp} value={sp}>
                        {sp} {dict.pts}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={13}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Due Date + Status */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <Calendar size={12} className="text-indigo-500" /> {dict.dueDate}
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <CheckCircle2 size={12} className="text-indigo-500" /> {dict.status}
                </label>
                <div className="relative">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TodoStatus)}
                    className="h-10 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-3 pr-8 text-xs font-bold capitalize text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="in_review">In Review</option>
                    <option value="done">Done</option>
                  </select>
                  <ChevronDown
                    size={13}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {dict.description}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder={dict.descriptionPlaceholder}
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-800"
              />
            </div>

            {/* Metadata (مترجمة بالكامل الآن) */}
            <div className="space-y-2 rounded-xl border border-slate-200/60 bg-slate-50 p-3.5 text-[11px] text-slate-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Clock size={11} className="shrink-0 text-slate-400" />
                <span>
                  {dict.created}:{" "}
                  <strong className="text-slate-800 dark:text-slate-200">
                    {new Date(todo.createdAt).toLocaleString()}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={11} className="shrink-0 text-slate-400" />
                <span>
                  {dict.updated}:{" "}
                  <strong className="text-slate-800 dark:text-slate-200">
                    {new Date(todo.updatedAt).toLocaleString()}
                  </strong>
                </span>
              </div>
              {todo.completedAt && (
                <div className="flex items-center gap-2 border-t border-slate-200 pt-2 font-semibold text-emerald-600 dark:border-slate-800 dark:text-emerald-400">
                  <CheckCircle2 size={11} className="shrink-0" />
                  <span>
                    {dict.completed}:{" "}
                    {new Date(todo.completedAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/90 px-8 py-4 dark:border-slate-800 dark:bg-slate-900/90">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-10 rounded-xl px-5 text-xs font-semibold cursor-pointer"
            >
              {dict.cancel}
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isUpdating}
              isLoading={isUpdating}
              className="h-10 rounded-xl px-5 text-xs font-semibold cursor-pointer"
            >
              {dict.save}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
