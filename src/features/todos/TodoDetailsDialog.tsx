import { useState } from "react";
import {
  X,
  Save,
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
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-xl h-full bg-white dark:bg-slate-900 shadow-2xl shadow-indigo-950/10 border-s border-slate-200/80 dark:border-slate-800 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300 relative">
        {/* Header (ثابت بالأعلى) */}
        <div className="flex items-center justify-between border-b border-slate-100 px-8 py-5 dark:border-slate-800 bg-gradient-to-r from-slate-50/90 via-white to-slate-50/50 dark:from-slate-900/90 dark:via-slate-900 dark:to-slate-900/50 shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex h-8 items-center justify-center rounded-xl bg-indigo-600/10 px-3 font-mono text-xs font-bold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 ring-1 ring-indigo-500/20 shadow-xs">
              {todo.key}
            </span>
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
                {dict.editTask}
              </h2>
              <p className="text-[11px] font-medium text-slate-400">
                Manage task properties & workflow
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-all shadow-2xs cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body (مساحات مريحة، عريضة، وبدون سكرول مزعج) */}
        <div className="flex-1 px-8 py-6 space-y-5 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {/* Title */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {dict.title}
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-12 rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none transition-all focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 shadow-2xs"
            />
          </div>

          {/* Grid Options (تأخذ كامل العرض بصفوف منسقة) */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Flame size={12} className="text-amber-500" /> {dict.priority}
              </label>
              <div className="relative">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TodoPriority)}
                  className="w-full h-11 rounded-xl border border-slate-200/80 bg-slate-50/50 px-3 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none transition-all focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 capitalize cursor-pointer appearance-none pr-8"
                >
                  {TODO_PRIORITIES.map((p) => (
                    <option
                      key={p}
                      value={p}
                      className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium"
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Layers size={12} className="text-indigo-500" /> {dict.type}
              </label>
              <div className="relative">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as TodoType)}
                  className="w-full h-11 rounded-xl border border-slate-200/80 bg-slate-50/50 px-3 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none transition-all focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 capitalize cursor-pointer appearance-none pr-8"
                >
                  {TODO_TYPES.map((tp) => (
                    <option
                      key={tp}
                      value={tp}
                      className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium"
                    >
                      {tp.charAt(0).toUpperCase() + tp.slice(1)}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Tag size={12} className="text-emerald-500" /> {dict.points}
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
                  className="w-full h-11 rounded-xl border border-slate-200/80 bg-slate-50/50 px-3 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none transition-all focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 cursor-pointer appearance-none pr-8"
                >
                  <option
                    value=""
                    className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium"
                  >
                    {dict.none}
                  </option>
                  {STORY_POINTS.map((sp) => (
                    <option
                      key={sp}
                      value={sp}
                      className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium"
                    >
                      {sp} {dict.pts}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Due Date & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Calendar size={13} className="text-indigo-500" /> Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full h-11 rounded-xl border border-slate-200/80 bg-slate-50/50 px-3 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none transition-all focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 shadow-2xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-indigo-500" /> Status
              </label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TodoStatus)}
                  className="w-full h-11 rounded-xl border border-slate-200/80 bg-slate-50/50 px-3 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none transition-all focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 capitalize cursor-pointer appearance-none pr-8"
                >
                  <option
                    value="todo"
                    className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium"
                  >
                    To Do
                  </option>
                  <option
                    value="in_progress"
                    className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium"
                  >
                    In Progress
                  </option>
                  <option
                    value="done"
                    className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium"
                  >
                    Done
                  </option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Description (تم تكبير المساحة لتصبح أوسع وأريح بكثير) */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {dict.description}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder={dict.descriptionPlaceholder}
              className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 text-xs font-medium text-slate-900 dark:text-slate-100 outline-none transition-all focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 resize-none shadow-2xs"
            />
          </div>

          {/* Metadata Card */}
          <div className="rounded-xl border border-slate-200/60 bg-slate-50/80 p-3.5 space-y-2 dark:border-slate-800 dark:bg-slate-900/60 text-[11px] text-slate-600 dark:text-slate-300 shadow-xs">
            <div className="flex items-center gap-2">
              <Clock size={12} className="text-slate-400" />
              <span>
                Created:{" "}
                <strong className="text-slate-800 dark:text-slate-100">
                  {new Date(todo.createdAt).toLocaleString()}
                </strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={12} className="text-slate-400" />
              <span>
                Updated:{" "}
                <strong className="text-slate-800 dark:text-slate-100">
                  {new Date(todo.updatedAt).toLocaleString()}
                </strong>
              </span>
            </div>
            {todo.completedAt && (
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold pt-2 border-t border-slate-200/60 dark:border-slate-800">
                <CheckCircle2 size={12} />
                <span>
                  Completed: {new Date(todo.completedAt).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer (ثابت بالأفل) */}
        <div className="flex items-center justify-end border-t border-slate-100 px-8 py-4 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 shadow-inner shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="rounded-xl h-10 px-5 text-xs font-semibold cursor-pointer"
            >
              {dict.cancel}
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isUpdating}
              leftIcon={<Save size={15} />}
              className="rounded-xl h-10 px-5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              {dict.save}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
