import { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  aiChat,
  aiGenerateTodos,
  aiPlanSprint,
  aiSummarizeSprint,
  getAiStatus,
} from "../api/ai";
import { bulkCreateTodos } from "../api/todos";
import type {
  ChatMessage,
  DraftTodo,
  GenerateTodosRequest,
  PlanSprintRequest,
} from "../types/api";

/** AI-5: بيتجاب مرة وحدة للتطبيق كله */
export function useAiStatus() {
  const query = useQuery({
    queryKey: ["ai", "status"],
    queryFn: getAiStatus,
    staleTime: Infinity,
    retry: false,
  });
  return { status: query.data ?? null, isMock: query.data?.mode === "mock" };
}

/**
 * AI-1: الخادم ما بيخزّن شي، فبنبعت المحادثة كاملة كل مرة.
 * لازم يُستعمل داخل مكوّن عليه key={projectId} (هيك بتتصفّر المحادثة بدون effect).
 */
export function useAiChat(projectId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const mutation = useMutation({
    mutationFn: (history: ChatMessage[]) =>
      aiChat(projectId, history.slice(-30)),
    onSuccess: (res, history) => setMessages([...history, res.message]),
  });

  const send = (text: string) => {
    const content = text.trim().slice(0, 4000);
    if (!content || mutation.isPending) return;
    const history: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(history);
    mutation.mutate(history);
  };

  // بعد فشل، آخر رسالة بتضل "user"، فبنعيد الإرسال بدون تكرارها
  const retry = () => {
    if (messages.at(-1)?.role === "user" && !mutation.isPending) {
      mutation.mutate(messages);
    }
  };

  const resetMutation = mutation.reset;
  const newChat = useCallback(() => {
    setMessages([]);
    resetMutation();
  }, [resetMutation]);

  return {
    messages,
    send,
    retry,
    newChat,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}

/** AI-2: توليد مسودات (ما بيحفظ شي) */
export function useGenerateTodos(projectId: string) {
  return useMutation({
    mutationFn: (body: GenerateTodosRequest) =>
      aiGenerateTodos(projectId, body),
  });
}

/** AI-2: حفظ المسودات المحددة (فقط عند "Add N to backlog") */
export function useSaveDraftTodos(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (drafts: DraftTodo[]) =>
      bulkCreateTodos(projectId, { todos: drafts }),
    onSuccess: () =>
      Promise.all([
        // بيغطي المهام والسبرنتات والإحصائيات تحت ["projects", projectId, ...]
        qc.invalidateQueries({ queryKey: ["projects", projectId] }),
        // قائمة المشاريع (backlogCount). افتراض: مفتاحها ["projects"]
        qc.invalidateQueries({ queryKey: ["projects"], exact: true }),
      ]),
  });
}

/** AI-3: اقتراح الخطة فقط. إنشاء السبرنت بيتم بـ useSprints().createSprint */
export function usePlanSprint(projectId: string) {
  return useMutation({
    mutationFn: (body: PlanSprintRequest) => aiPlanSprint(projectId, body),
  });
}

/** AI-4: الخادم بيحفظ الملخص، فنحدّث السبرنت وصفحة الـ Board */
export function useSprintSummary() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (sprintId: string) => aiSummarizeSprint(sprintId),
    onSuccess: (res) =>
      Promise.all([
        qc.invalidateQueries({
          queryKey: ["projects", res.sprint.projectId, "sprints"],
        }),
        qc.invalidateQueries({ queryKey: ["sprints", res.sprint.id] }),
      ]),
  });
}
