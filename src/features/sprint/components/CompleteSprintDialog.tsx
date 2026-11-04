import { useState } from "react";
import { Layers } from "lucide-react";
import { Dialog } from "../../../components/ui/Dialog";
import { Button } from "../../../components/ui/Button";
import type { Sprint } from "../../../types/api";

interface CompleteSprintDialogProps {
  isOpen: boolean;
  onClose: () => void;
  activeSprint: Sprint | null;
  plannedSprints: Sprint[];
  onConfirm: (
    targetSprintId: string | null,
    generateSummary: boolean,
  ) => Promise<void>;
  isPending: boolean;
}

export function CompleteSprintDialog({
  isOpen,
  onClose,
  activeSprint,
  plannedSprints,
  onConfirm,
  isPending,
}: CompleteSprintDialogProps) {
  const [destination, setDestination] = useState<string>("backlog");
  const [generateAi, setGenerateAi] = useState<boolean>(true);

  if (!isOpen || !activeSprint) return null;

  const handleComplete = async () => {
    const target = destination === "backlog" ? null : destination;
    await onConfirm(target, generateAi);
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={`Complete ${activeSprint.name}`}
    >
      <div className="space-y-4 py-2">
        <p className="text-xs text-slate-600 dark:text-slate-400">
          This sprint has unfinished tasks. Where would you like to move them?
        </p>

        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Unfinished tasks destination
          </label>
          <div className="relative">
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 pr-8 text-xs font-semibold text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="backlog">Backlog (Default)</option>
              {plannedSprints.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (Planned)
                </option>
              ))}
            </select>
            <Layers
              size={13}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="generateAi"
            checked={generateAi}
            onChange={(e) => setGenerateAi(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
          <label
            htmlFor="generateAi"
            className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            Generate AI summary for this sprint
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={isPending}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={() => void handleComplete()}
            isLoading={isPending}
            disabled={isPending}
            className="cursor-pointer"
          >
            Complete Sprint
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
