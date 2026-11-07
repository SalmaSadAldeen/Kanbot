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
  ListTodo,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import type {
  Todo,
  Sprint,
  TodoPriority,
  TodoType,
  StoryPoints,
  TodoStatus,
} from "../../types/api";
import { TODO_PRIORITIES, TODO_TYPES, STORY_POINTS } from "../../types/api";
import { useTodos } from "../../hooks/useTodos";
import { useTranslation } from "../../store/useAppStore";
import toast from "react-hot-toast";

interface TodoDetailsDialogProps {
  todo: Todo | null;
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  sprints?: Sprint[];
}

export function TodoDetailsDialog({
  todo,
  projectId,
  isOpen,
  onClose,
  sprints = [],
}: TodoDetailsDialogProps) {
  const { t, isRtl } = useTranslation();
  const dict = t.projectsPage.todoDetails;

  const { updateTodo, isUpdating } = useTodos(projectId);

  // التهيئة الأولية للحالات مباشرة من الـ todo (بفضل استخدام key في الأب، لن نحتاج لـ useEffect)
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
  const [sprintId, setSprintId] = useState<string | null>(
    () => todo?.sprintId ?? null,
  );
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen || !todo) return null;

  // فحص هل توجد تغييرات غير محفوظة؟
  const isDirty =
    title !== (todo.title ?? "") ||
    description !== (todo.description ?? "") ||
    priority !== (todo.priority ?? "medium") ||
    type !== (todo.type ?? "task") ||
    storyPoints !== (todo.storyPoints ?? null) ||
    status !== (todo.status ?? "todo") ||
    dueDate !== (todo.dueDate ?? "") ||
    sprintId !== (todo.sprintId ?? null);

  const handleSafeClose = () => {
    if (isDirty) {
      toast(
        (t) => (
          <div className="flex items-center justify-between gap-4 w-full">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {isRtl
                ? "تغييرات غير محفوظة، هل تريد التجاهل؟"
                : "Unsaved changes. Discard?"}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  toast.dismiss(t.id);
                  onClose();
                }}
                className="rounded-md bg-rose-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs transition hover:bg-rose-700 cursor-pointer"
              >
                {isRtl ? "تجاهل" : "Discard"}
              </button>
              <button
                type="button"
                onClick={() => toast.dismiss(t.id)}
                className="rounded-md bg-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-800 transition hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 cursor-pointer"
              >
                {isRtl ? "إلغاء" : "Keep"}
              </button>
            </div>
          </div>
        ),
        {
          duration: Infinity,
          position: "top-center",
          style: {
            background: "var(--toast-bg, #ffffff)",
            color: "var(--toast-color, #0f172a)",
            border: "1px solid #e2e8f0",
            padding: "12px 16px",
            borderRadius: "12px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          },
        },
      );
      return;
    }
    onClose();
  };

  const handleSave = async () => {
    setFormError(null);
    if (!title.trim()) {
      setFormError(isRtl ? "عنوان المهمة مطلوب" : "Task title is required");
      return;
    }

    try {
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
          sprintId,
        },
      });
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update todo";
      setFormError(msg);
    }
  };

  return (
    <>
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

      <div
        className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm"
        style={{ animation: "detailsFadeIn 0.2s ease" }}
      >
        <div
          className="relative flex h-full w-full max-w-xl flex-col overflow-hidden border-s border-slate-200/80 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
          style={{
            animation: "detailsSlideIn 0.25s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {/* Header */}
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
                  {isRtl
                    ? "إدارة خصائص وتدفق المهمة"
                    : "Manage task properties & workflow"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSafeClose}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 space-y-5 overflow-y-auto px-8 py-6">
            {formError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400">
                {formError}
              </div>
            )}

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

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <ListTodo size={12} className="text-violet-500" />{" "}
                {isRtl
                  ? "السبرنت المستهدف / الباكلوغ"
                  : "Target Sprint / Backlog"}
              </label>
              <div className="relative">
                <select
                  value={sprintId ?? "backlog"}
                  onChange={(e) =>
                    setSprintId(
                      e.target.value === "backlog" ? null : e.target.value,
                    )
                  }
                  className="h-10 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 ps-3 pe-8 text-xs font-bold text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="backlog">
                     {isRtl ? "الباكلوغ (بدون سبرنت)" : "Backlog (No Sprint)"}
                  </option>
                  {sprints.map((s) => (
                    <option key={s.id} value={s.id}>
                       {s.name} ({s.status})
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={13}
                  className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
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
                    className="h-10 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 ps-3 pe-8 text-xs font-bold capitalize text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    {TODO_PRIORITIES.map((p) => (
                      <option key={p} value={p}>
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={13}
                    className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <Layers size={11} className="text-indigo-500" /> {dict.type}
                </label>
                <div className="relative">
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as TodoType)}
                    className="h-10 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 ps-3 pe-8 text-xs font-bold capitalize text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    {TODO_TYPES.map((tp) => (
                      <option key={tp} value={tp}>
                        {tp.charAt(0).toUpperCase() + tp.slice(1)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={13}
                    className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

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
                    className="h-10 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 ps-3 pe-8 text-xs font-bold text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
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
                    className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <Calendar size={12} className="text-indigo-500" />{" "}
                  {dict.dueDate}
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
                  <CheckCircle2 size={12} className="text-indigo-500" />{" "}
                  {dict.status}
                </label>
                <div className="relative">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TodoStatus)}
                    className="h-10 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 ps-3 pe-8 text-xs font-bold capitalize text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="in_review">In Review</option>
                    <option value="done">Done</option>
                  </select>
                  <ChevronDown
                    size={13}
                    className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>
            </div>

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
            </div>
          </div>

          {/* Footer */}
          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/90 px-8 py-4 dark:border-slate-800 dark:bg-slate-900/90">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSafeClose}
              className="h-10 rounded-xl px-5 text-xs font-semibold cursor-pointer"
            >
              {dict.cancel}
            </Button>
            <Button
              size="sm"
              onClick={() => void handleSave()}
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
