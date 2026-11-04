import type { KeyboardEvent } from "react";
import { Plus } from "lucide-react";
import { Spinner } from "../../../components/ui/Spinner";

interface QuickCreateBarProps {
  quickTitle: string;
  setQuickTitle: (val: string) => void;
  onQuickKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  isPending: boolean;
  isError: boolean;
  errorMessage?: string;
  placeholder: string;
  hintText: string;
}

export function QuickCreateBar({
  quickTitle,
  setQuickTitle,
  onQuickKeyDown,
  isPending,
  isError,
  errorMessage,
  placeholder,
  hintText,
}: QuickCreateBarProps) {
  return (
    <div className="border-t border-slate-100/80 bg-slate-50/60 p-3 dark:border-slate-800/40 dark:bg-slate-900/40">
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 shrink-0">
          <Plus size={16} />
        </div>
        <input
          value={quickTitle}
          onChange={(event) => setQuickTitle(event.target.value)}
          onKeyDown={onQuickKeyDown}
          maxLength={200}
          placeholder={placeholder}
          aria-label={placeholder}
          disabled={isPending}
          className="h-10 min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 disabled:opacity-60 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
        {isPending && <Spinner size="sm" inline className="text-indigo-600" />}
      </div>
      <p className="ms-10 mt-1 text-[11px] font-medium text-slate-400">
        {isError && errorMessage ? errorMessage : hintText}
      </p>
    </div>
  );
}
