import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { Send, Sparkles, PlusCircle, Calendar, FileText } from "lucide-react";
import { useAiChat } from "../../../hooks/useAi";
import { useTranslation } from "../../../store/useAppStore";
import { AiStateBlock } from "./AiStateBlock";
import { ChatBubble } from "./ChatBubble";

export function AiChatPanel({
  onQuickAction,
  hasActiveSprint,
}: {
  onQuickAction: (action: "generate" | "plan" | "summary") => void;
  hasActiveSprint: boolean;
}) {
  const { projectId = "" } = useParams();
  const { t, isRtl } = useTranslation();
  const c = t.ai;
  const { messages, send, retry, newChat, isPending, error } =
    useAiChat(projectId);
  const [text, setText] = useState("");

  // مرجع لتحديد نهاية المحادثة من أجل التمرير التلقائي
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // التمرير التلقائي للأسفل عند تغير الرسائل أو بدء حالة الانتظار (التفكير)
  useEffect(() => {
    scrollToBottom();
  }, [messages, isPending]);

  const submit = () => {
    if (!text.trim() || isPending) return;
    send(text);
    setText("");
  };

  useEffect(() => {
    const reset = () => newChat();
    window.addEventListener("kanbot:new-ai-chat", reset);
    return () => window.removeEventListener("kanbot:new-ai-chat", reset);
  }, [newChat]);

  return (
    <div key={projectId} className="flex min-h-0 flex-1 flex-col gap-3.5">
      {/* أزرار الإجراءات السريعة */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50/60 px-3 py-2 text-xs font-bold text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:border-indigo-900/50 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400 transition-all cursor-pointer shadow-2xs"
          onClick={() => onQuickAction("generate")}
        >
          <PlusCircle size={14} className="text-indigo-500" />
          <span>{c.createTodos}</span>
        </button>

        <button
          type="button"
          className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50/60 px-3 py-2 text-xs font-bold text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:border-indigo-900/50 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400 transition-all cursor-pointer shadow-2xs"
          onClick={() => onQuickAction("plan")}
        >
          <Calendar size={14} className="text-violet-500" />
          <span>{c.planSprint}</span>
        </button>

        <button
          type="button"
          disabled={!hasActiveSprint}
          title={!hasActiveSprint ? c.noActiveSprint : undefined}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50/60 px-3 py-2 text-xs font-bold text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:border-indigo-900/50 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400 transition-all cursor-pointer shadow-2xs"
          onClick={() => onQuickAction("summary")}
        >
          <FileText size={14} className="text-emerald-500" />
          <span>{c.summarize}</span>
        </button>
      </div>

      {/* منطقة الرسائل */}
      <div
        className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto px-1 py-2 custom-scrollbar"
        aria-live="polite"
      >
        {messages.length ? (
          messages.map((m, i) => (
            <ChatBubble key={`${i}-${m.role}`} message={m} />
          ))
        ) : (
          <div className="my-auto flex flex-col items-center justify-center gap-2.5 text-center px-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 shadow-inner">
              <Sparkles size={22} className="animate-pulse" />
            </div>
            <p className="text-xs font-semibold text-slate-400 leading-relaxed">
              {c.emptyChat}
            </p>
          </div>
        )}

        {/* مؤشر الـ Thinking الفخم والذكي أثناء الانتظار */}
        {isPending && (
          <div className="flex items-center gap-2.5 me-auto rounded-2xl rounded-es-xs bg-slate-100/90 px-4 py-3 text-xs font-bold text-slate-500 border border-slate-200/60 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700/60 animate-pulse shadow-sm">
            <Sparkles size={14} className="text-indigo-500 animate-spin" />
            <span>{c.thinking || "Thinking..."}</span>
          </div>
        )}

        <AiStateBlock error={error} onRetry={retry} />

        {/* عنصر وهمي بالأسفل لنضمن النزول إليه تماماً */}
        <div ref={messagesEndRef} />
      </div>

      <p className="text-[11px] font-medium text-slate-400 px-1">
        {c.disclaimer}
      </p>

      {/* حقل الإدخال السفلي */}
      <div className="flex items-end gap-2.5 border-t border-slate-100 pt-3 dark:border-slate-800">
        <textarea
          value={text}
          maxLength={4000}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          aria-label={c.messagePlaceholder}
          placeholder={c.messagePlaceholder}
          rows={2}
          className="min-w-0 flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-medium text-slate-800 outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:bg-slate-900 transition-all shadow-2xs"
        />
        <button
          type="button"
          disabled={isPending || !text.trim()}
          aria-label={c.send}
          onClick={submit}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 disabled:opacity-40 disabled:shadow-none hover:bg-indigo-700 transition-all cursor-pointer"
        >
          <Send className={isRtl ? "rotate-180" : ""} size={16} />
        </button>
      </div>
    </div>
  );
}
