import ReactMarkdown from "react-markdown";
import type { ChatMessage } from "../../../types/api";

export function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <article
      className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm transition-all ${
        isUser
          ? "ms-auto bg-indigo-600 text-white rounded-ee-xs"
          : "me-auto bg-slate-100/90 text-slate-800 rounded-es-xs border border-slate-200/60 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700/60"
      }`}
    >
      <div className="prose prose-xs max-w-none dark:prose-invert font-medium">
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </div>
    </article>
  );
}
