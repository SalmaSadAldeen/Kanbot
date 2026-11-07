import { useParams } from "react-router";
import { X, RotateCcw, Sparkles } from "lucide-react";
import { useAiUi } from "../../../store/useAiUi";
import { useAiStatus } from "../../../hooks/useAi";
import { useSprints } from "../../../hooks/useSprints";
import { useTranslation } from "../../../store/useAppStore";
import { AiChatPanel } from "./AiChatPanel";

export function AiDrawer() {
  const { projectId = "" } = useParams();
  const { t } = useTranslation();
  const c = t.ai;
  const open = useAiUi((s) => s.drawerOpen);
  const setOpen = useAiUi((s) => s.setDrawerOpen);
  const openDialog = useAiUi((s) => s.openDialog);
  const openSummary = useAiUi((s) => s.openSummary);
  const { allSprints } = useSprints(projectId);
  const { isMock } = useAiStatus();
  const active = allSprints.find((s) => s.status === "active");

  return (
    <aside
      aria-label={c.title}
      aria-hidden={!open}
      inert={!open}
      className={`fixed inset-y-0 end-0 z-[60] flex w-full max-w-md flex-col border-s border-slate-200/80 bg-white/95 p-5 shadow-2xl backdrop-blur-2xl transition-transform duration-300 ease-out dark:border-slate-800 dark:bg-slate-900/95 ${
        open ? "translate-x-0" : "translate-x-full rtl:-translate-x-full"
      }`}
    >
      {/* الهيدر الفخم */}
      <header className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shadow-inner dark:bg-indigo-950/60 dark:text-indigo-400">
            <Sparkles size={18} />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-tight text-slate-900 dark:text-slate-100">
              {c.title}
            </h2>
            <p className="text-[10px] font-semibold text-slate-400">
              {c.workspace}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {isMock ? (
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700 border border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50 shadow-2xs">
              {c.mock}
            </span>
          ) : (
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50 shadow-2xs flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {c.live}
            </span>
          )}

          <button
            type="button"
            aria-label={c.newChat}
            title={c.newChat}
            onClick={() =>
              window.dispatchEvent(new Event("kanbot:new-ai-chat"))
            }
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw size={15} />
          </button>
          <button
            type="button"
            aria-label={c.close}
            title={c.close}
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
      </header>

      <AiChatPanel
        key={projectId}
        hasActiveSprint={!!active}
        onQuickAction={(action) => {
          setOpen(false);
          if (action === "generate") openDialog("generate");
          else if (action === "plan") openDialog("plan");
          else if (active) openSummary(active.id);
        }}
      />
    </aside>
  );
}
