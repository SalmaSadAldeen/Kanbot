import ReactMarkdown from "react-markdown";
import type { ChatMessage } from "../../../types/api";
export function ChatBubble({ message }: { message: ChatMessage }) {
  return <article className={`max-w-[90%] rounded-xl px-3 py-2 text-sm leading-relaxed ${message.role === "user" ? "ms-auto bg-indigo-600 text-white" : "me-auto bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100"}`}><ReactMarkdown>{message.content}</ReactMarkdown></article>;
}
