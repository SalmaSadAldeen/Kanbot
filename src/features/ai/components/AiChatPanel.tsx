import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Send } from "lucide-react";
import { useAiChat } from "../../../hooks/useAi";
import { useTranslation } from "../../../store/useAppStore";
import { AiStateBlock } from "./AiStateBlock";
import { ChatBubble } from "./ChatBubble";

export function AiChatPanel({ onQuickAction, hasActiveSprint }: { onQuickAction: (action: "generate"|"plan"|"summary")=>void; hasActiveSprint: boolean }) {
 const { projectId = "" }=useParams(); const {t,isRtl}=useTranslation(); const c=t.ai; const {messages,send,retry,newChat,isPending,error}=useAiChat(projectId); const [text,setText]=useState("");
 const submit=()=>{if(!text.trim()||isPending)return;send(text);setText("")};
 useEffect(()=>{const reset=()=>newChat();window.addEventListener("kanbot:new-ai-chat",reset);return()=>window.removeEventListener("kanbot:new-ai-chat",reset)},[newChat]);
 return <div key={projectId} className="flex min-h-0 flex-1 flex-col gap-3">
  <div className="flex flex-wrap gap-2"><button className="rounded-full border px-3 py-1.5 text-xs dark:border-slate-700" onClick={()=>onQuickAction("generate")}>{c.createTodos}</button><button className="rounded-full border px-3 py-1.5 text-xs dark:border-slate-700" onClick={()=>onQuickAction("plan")}>{c.planSprint}</button><button disabled={!hasActiveSprint} title={!hasActiveSprint?c.noActiveSprint:undefined} className="rounded-full border px-3 py-1.5 text-xs disabled:opacity-50 dark:border-slate-700" onClick={()=>onQuickAction("summary")}>{c.summarize}</button></div>
  <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto py-2" aria-live="polite">{messages.length?messages.map((m,i)=><ChatBubble key={`${i}-${m.role}`} message={m}/>):<p className="my-auto text-center text-sm text-slate-500">{c.emptyChat}</p>}<AiStateBlock loading={isPending} error={error} onRetry={retry}/></div>
  <p className="text-xs text-slate-500">{c.disclaimer}</p>
  <div className="flex items-end gap-2 border-t pt-3 dark:border-slate-700"><textarea value={text} maxLength={4000} onChange={e=>setText(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();submit()}}} aria-label={c.messagePlaceholder} placeholder={c.messagePlaceholder} rows={2} className="min-w-0 flex-1 resize-none rounded-xl border border-slate-300 bg-white p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900"/><button type="button" disabled={isPending||!text.trim()} aria-label={c.send} onClick={submit} className="rounded-xl bg-indigo-600 p-3 text-white disabled:opacity-50"><Send className={isRtl?"rotate-180":""} size={17}/></button></div>
 </div>
}
