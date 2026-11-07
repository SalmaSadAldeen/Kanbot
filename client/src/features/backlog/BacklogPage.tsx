import { useState, type KeyboardEvent, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import toast from "react-hot-toast";
import { Trash2, RotateCcw } from "lucide-react";
import { Spinner } from "../../components/ui/Spinner";
import { useTranslation } from "../../store/useAppStore";
import type {
  Todo,
  Sprint,
  CreateSprintRequest,
  StartSprintRequest,
} from "../../types/api";
import { useBacklogMaster } from "../../hooks/useBacklogMaster";
import { useSprints } from "../../hooks/useSprints";
import { useTodos } from "../../hooks/useTodos";
import { BacklogHeader } from "./components/BacklogHeader";
import { SectionHeader } from "./components/SectionHeader";
import { BacklogSectionList } from "../todos/BacklogSectionList";
import { QuickCreateBar } from "./components/QuickCreateBar";
import { TodoDetailsDialog } from "../todos/TodoDetailsDialog";
import { SprintsList } from "../sprint/SprintsList";
import { SprintFormDialog } from "../sprint/components/SprintFormDialog";

export function BacklogPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { t, isRtl } = useTranslation();
  const copy = t.projectsPage.backlogPage;

  const { createTodo, deleteTodo, moveTodo, isCreating } = useTodos(
    projectId,
    "backlog",
  );

  const {
    backlogTodos,
    filteredTodos,
    rawBacklogTodos,
    isLoading: isBacklogLoading,
    error: backlogError,
    refetchBacklog,
    search,
    setSearch,
    priority,
    setPriority,
    type,
    setType,
    collapsed,
    toggleSection,
  } = useBacklogMaster(projectId);

  const {
    sprints,
    allSprints,
    isLoading: isSprintsLoading,
    error: sprintsError,
    refetch: refetchSprints,
    createSprint,
    updateSprint,
    deleteSprint,
    startSprint,
  } = useSprints(projectId);

  const [quickTitle, setQuickTitle] = useState<string>("");
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);

  const [isSprintDialogOpen, setIsSprintDialogOpen] = useState(false);
  const [editingSprint, setEditingSprint] = useState<Sprint | null>(null);

  // حالات الإجراءات الجماعية ووضع التحديد
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedTodoIds, setSelectedTodoIds] = useState<string[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // حالة التراجع (Undo State) للحذف الجماعي
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[] | null>(
    null,
  );
  const bulkTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggleSelectTodo = (id: string) => {
    setSelectedTodoIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };
  // تنفيذ الحذف الجماعي مع إشعار تراجع واحد فقط لا غير
  // تنفيذ الحذف الجماعي: توست تراجع أولاً، وعندما ينتهي ويختفي تماماً يتم إظهار توست النجاح لوحده
  // تنفيذ الحذف الجماعي بتتابع قطعي: يظهر التراجع، وإذا انتهى يختفي تماماً وبعد نصف ثانية يظهر توست النجاح الوحيد
  // تنفيذ الحذف الجماعي: يظهر التراجع لـ 4 ثوانٍ، يختفي تماماً، وبعده بثانيتين كاملتين يظهر توست النجاح النهائي
  const handleBulkDelete = () => {
    if (!selectedTodoIds.length || !projectId || isBulkDeleting) return;

    const idsToDelete = [...selectedTodoIds];
    setPendingDeleteIds(idsToDelete);
    setSelectedTodoIds([]);
    setIsSelectMode(false);

    toast.dismiss();

    let isUndoing = false;

    // 1. إظهار توست التراجع الأبيض لمدة 4 ثوانٍ
    const undoToastId = toast.custom(
      (tInstance) => (
        <div
          className={`${
            tInstance.visible ? "animate-enter" : "animate-leave"
          } flex items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3 text-slate-800 shadow-xl border border-slate-200/90`}
        >
          <span className="text-xs font-semibold">
            {isRtl
              ? `تمت إزالة ${idsToDelete.length} مهام`
              : `Removed ${idsToDelete.length} tasks`}
          </span>
          <button
            type="button"
            onClick={() => {
              isUndoing = true;
              if (bulkTimeoutRef.current) clearTimeout(bulkTimeoutRef.current);
              setPendingDeleteIds(null);

              // 1. إخفاء توست التراجع فوراً عند الضغط
              toast.dismiss(undoToastId);

              // 2. الانتظار لمدة ثانيتين بعد اختفائه، ثم إظهار توست التراجع الناجح لوحده
              setTimeout(() => {
                toast.success(
                  isRtl
                    ? "تم التراجع عن الحذف بنجاح"
                    : "Deletion undone successfully",
                  {
                    id: "undo-success-toast",
                    duration: 3000,
                  },
                );
              }, 2000);
            }}
            className="flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-600 hover:bg-indigo-100 transition-colors cursor-pointer"
          >
            <RotateCcw size={12} />
            <span>{isRtl ? "تراجع" : "Undo"}</span>
          </button>
        </div>
      ),
      { duration: 4000 },
    );

    // 2. مؤقت الـ 4 ثوانٍ لانتهاء مهلة التراجع وتفريغ المهام بالخلفية
    bulkTimeoutRef.current = setTimeout(async () => {
      // إغلاق توست التراجع فوراً من الشاشة
      toast.dismiss(undoToastId);

      if (isUndoing) return;

      setIsBulkDeleting(true);

      try {
        await Promise.all(
          idsToDelete.map((id: string) => deleteTodo(id, true)),
        );
        setPendingDeleteIds(null);
        await refetchBacklog();

        // 3. الانتظار لمدة ثانيتين كاملتين (2000 ميلي ثانية) بعد اختفاء التوست الأول، ثم إظهار توست النجاح
        setTimeout(() => {
          if (!isUndoing) {
            toast.success(
              isRtl
                ? `تم حذف ${idsToDelete.length} مهام بنجاح`
                : `Successfully deleted ${idsToDelete.length} tasks`,
              { id: "bulk-success-toast", duration: 3000 },
            );
          }
        }, 2000);
      } catch {
        toast.error(
          isRtl ? "فشل حذف بعض المهام" : "Failed to delete some tasks",
        );
      } finally {
        setIsBulkDeleting(false);
      }
    }, 4000);
  };
  useEffect(() => {
    return () => {
      if (bulkTimeoutRef.current) clearTimeout(bulkTimeoutRef.current);
    };
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const totalPoints = filteredTodos.reduce(
    (sum: number, todo: Todo) => sum + (todo.storyPoints ?? 0),
    0,
  );

  const backlogPoints = backlogTodos.reduce(
    (sum: number, todo: Todo) => sum + (todo.storyPoints ?? 0),
    0,
  );

  const handleSprintSubmit = async (data: CreateSprintRequest) => {
    try {
      if (editingSprint) {
        await updateSprint.mutateAsync({ sprintId: editingSprint.id, data });
      } else {
        await createSprint.mutateAsync(data);
      }
      setIsSprintDialogOpen(false);
      setEditingSprint(null);
    } catch (err) {
      console.error("Failed to save sprint:", err);
    }
  };

  const submitQuickCreate = async () => {
    const title = quickTitle.trim();
    if (!title || !projectId) return;
    try {
      await createTodo({
        title,
        sprintId: null,
        status: "todo",
        priority: "medium",
      });
      setQuickTitle("");
      await refetchBacklog();
    } catch (err) {
      console.error("Failed to create todo:", err);
    }
  };

  const onQuickKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      void submitQuickCreate();
    } else if (event.key === "Escape") {
      setQuickTitle("");
      event.currentTarget.blur();
    }
  };

  const handleGlobalDragEnd = async (event: DragEndEvent): Promise<void> => {
    const { active, over } = event;
    if (!over || !projectId) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeTodo = rawBacklogTodos.find((t) => t.id === activeId);
    if (!activeTodo) return;

    const { targetSprintId, computedIndex } = (() => {
      if (overId.startsWith("sprint-container-")) {
        const sprintId = overId.replace("sprint-container-", "");
        const sprintTodos = rawBacklogTodos.filter(
          (t) => (t.sprintId ?? null) === sprintId,
        );
        return { targetSprintId: sprintId, computedIndex: sprintTodos.length };
      }

      if (overId === "backlog-container") {
        return { targetSprintId: null, computedIndex: backlogTodos.length };
      }

      const overTodo = rawBacklogTodos.find((t) => t.id === overId);
      if (!overTodo) {
        return {
          targetSprintId: activeTodo.sprintId ?? null,
          computedIndex: 0,
        };
      }

      const sprintId = overTodo.sprintId ?? null;
      const targetList = rawBacklogTodos.filter(
        (t) => (t.sprintId ?? null) === sprintId,
      );
      const overIndex = targetList.findIndex((t) => t.id === overId);

      return {
        targetSprintId: sprintId,
        computedIndex: overIndex !== -1 ? overIndex : targetList.length,
      };
    })();

    const finalTargetList = rawBacklogTodos.filter(
      (t) => (t.sprintId ?? null) === targetSprintId,
    );
    const clampedPosition = Math.max(
      0,
      Math.min(computedIndex, finalTargetList.length),
    );

    if (activeTodo.sprintId === targetSprintId && activeId === overId) {
      return;
    }

    try {
      await moveTodo({
        todoId: activeId,
        data: {
          sprintId: targetSprintId,
          status: activeTodo.status,
          position: clampedPosition,
        },
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to move task";
      toast.error(message);
    }
  };

  const isLoading = isBacklogLoading || isSprintsLoading;
  const pageError = backlogError || sprintsError;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 pb-24 relative">
      <BacklogHeader
        copy={copy}
        search={search}
        setSearch={setSearch}
        priority={priority}
        setPriority={setPriority}
        type={type}
        setType={setType}
        totalTodos={filteredTodos.length}
        totalPoints={totalPoints}
        isRtl={isRtl}
        onCreateSprint={() => {
          setEditingSprint(null);
          setIsSprintDialogOpen(true);
        }}
      />

      {isLoading ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 text-sm text-slate-500">
          <Spinner size="lg" className="text-indigo-600" />
          <span className="font-medium animate-pulse">
            {t.projectsPage.loading}
          </span>
        </div>
      ) : pageError ? (
        <div
          role="alert"
          className="rounded-2xl border border-rose-200 bg-rose-50/80 p-6 shadow-sm dark:border-rose-900/50 dark:bg-rose-950/20"
        >
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {copy.loadingError}
              </p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                {(pageError as Error).message}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                void refetchBacklog();
                void refetchSprints();
              }}
              className="cursor-pointer rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-900/40"
            >
              {copy.retry}
            </button>
          </div>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(e) => {
            void handleGlobalDragEnd(e);
          }}
        >
          <div className="space-y-6">
            <SprintsList
              sprints={sprints}
              allSprints={allSprints}
              allTodos={rawBacklogTodos}
              visibleTodos={filteredTodos}
              collapsedMap={collapsed}
              onToggleSection={toggleSection}
              onEditSprint={(s) => {
                setEditingSprint(s);
                setIsSprintDialogOpen(true);
              }}
              onDeleteSprint={(sprintId) =>
                void deleteSprint.mutateAsync(sprintId)
              }
              onStartSprint={async (
                sprintId: string,
                data: StartSprintRequest,
              ) => {
                await startSprint.mutateAsync({ sprintId, data });
                if (projectId) {
                  navigate(`/projects/${projectId}/board`);
                }
              }}
              onSelectTodo={(todo) => {
                setSelectedTodo(todo);
                setIsDetailsOpen(true);
              }}
              onEditTodo={(todo) => {
                setSelectedTodo(todo);
                setIsDetailsOpen(true);
              }}
            />

            <section className="rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                <div className="flex-1">
                  <SectionHeader
                    title={copy.backlog}
                    count={backlogTodos.length}
                    points={backlogPoints}
                    countLabel={copy.todos}
                    pointsLabel={copy.pts}
                    isCollapsed={collapsed.has("backlog")}
                    onToggle={() => toggleSection("backlog")}
                  />
                </div>

                {!collapsed.has("backlog") && backlogTodos.length > 0 && (
                  <div className="px-4">
                    <button
                      type="button"
                      onClick={() => {
                        const nextMode = !isSelectMode;
                        setIsSelectMode(nextMode);
                        if (!nextMode) setSelectedTodoIds([]);
                      }}
                      className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer border ${
                        isSelectMode
                          ? "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100"
                          : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                      }`}
                    >
                      {isSelectMode
                        ? isRtl
                          ? "إلغاء التحديد"
                          : "Cancel Selection"
                        : isRtl
                          ? "تحديد متعدد"
                          : "Select Multiple"}
                    </button>
                  </div>
                )}
              </div>

              {!collapsed.has("backlog") && (
                <>
                  <BacklogSectionList
                    containerId="backlog-container"
                    sprintId={null}
                    todos={backlogTodos.filter(
                      (t) => !pendingDeleteIds?.includes(t.id),
                    )}
                    rawTotalCount={rawBacklogTodos.length}
                    moreLabel={copy.moreActions}
                    noResultsText={copy.noResults}
                    emptyStateText={copy.emptyState}
                    isSelectMode={isSelectMode}
                    selectedTodoIds={selectedTodoIds}
                    onToggleSelectTodo={toggleSelectTodo}
                    onSelectTodo={(todo) => {
                      if (isSelectMode) {
                        toggleSelectTodo(todo.id);
                      } else {
                        setSelectedTodo(todo);
                        setIsDetailsOpen(true);
                      }
                    }}
                    onEditTodo={(todo) => {
                      setSelectedTodo(todo);
                      setIsDetailsOpen(true);
                    }}
                    sprintOptions={allSprints
                      .filter((sprint) => sprint.status !== "completed")
                      .map((sprint) => ({
                        id: sprint.id,
                        name: sprint.name,
                      }))}
                  />

                  <QuickCreateBar
                    quickTitle={quickTitle}
                    setQuickTitle={setQuickTitle}
                    onQuickKeyDown={onQuickKeyDown}
                    isPending={isCreating}
                    isError={false}
                    placeholder={copy.quickCreatePlaceholder}
                    hintText={copy.quickCreateHint}
                  />
                </>
              )}
            </section>
          </div>
        </DndContext>
      )}

      {/* شريط الإجراءات الجماعية الطافي الفاتح والمشرق */}
      {isSelectMode && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 rounded-2xl bg-white px-5 py-3 text-slate-800 shadow-2xl border border-slate-200/95 backdrop-blur-md animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center gap-2.5 border-e border-slate-200 pe-4">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-50 text-indigo-600 text-[11px] font-bold">
              {selectedTodoIds.length}
            </span>
            <span className="text-xs font-semibold text-slate-600">
              {isRtl ? "مهام محددة" : "selected"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBulkDelete}
              disabled={!selectedTodoIds.length || isBulkDeleting}
              className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer border border-slate-200 disabled:opacity-40"
            >
              <Trash2
                size={13}
                className="text-slate-500 hover:text-rose-500"
              />
              <span>
                {isBulkDeleting
                  ? isRtl
                    ? "جاري الحذف..."
                    : "Deleting..."
                  : isRtl
                    ? "حذف المحدد"
                    : "Delete Selected"}
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsSelectMode(false);
              setSelectedTodoIds([]);
            }}
            className="text-[11px] font-medium text-slate-400 hover:text-slate-700 ms-1 transition-colors cursor-pointer"
          >
            {isRtl ? "إغلاق" : "Close"}
          </button>
        </div>
      )}

      <SprintFormDialog
        key={
          isSprintDialogOpen
            ? (editingSprint?.id ?? "active-sprint-form")
            : "closed-sprint-form"
        }
        isOpen={isSprintDialogOpen}
        sprintToEdit={editingSprint}
        isPending={createSprint.isPending || updateSprint.isPending}
        error={createSprint.error || updateSprint.error}
        onClose={() => {
          setIsSprintDialogOpen(false);
          setEditingSprint(null);
        }}
        onSubmit={handleSprintSubmit}
      />

      {projectId && (
        <TodoDetailsDialog
          key={selectedTodo?.id ?? "closed-todo-details"}
          todo={selectedTodo}
          projectId={projectId}
          isOpen={isDetailsOpen}
          sprints={allSprints.filter((s) => s.status !== "completed")}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedTodo(null);
          }}
        />
      )}
    </div>
  );
}
