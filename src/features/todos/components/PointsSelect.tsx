import { STORY_POINTS } from "../../../types/api";
import type { StoryPoints } from "../../../types/api";
import { useTranslation } from "../../../store/useAppStore";

interface PointsSelectProps {
  value: StoryPoints | null;
  onChange?: (points: StoryPoints | null) => void;
  disabled?: boolean;
}

export function PointsSelect({
  value,
  onChange,
  disabled = false,
}: PointsSelectProps) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-1">
      <select
        value={value ?? ""}
        disabled={disabled}
        onChange={(e) => {
          const val = e.target.value;
          const points = val === "" ? null : (Number(val) as StoryPoints);
          onChange?.(points);
        }}
        aria-label={t.projectsPage.backlogPage.storyPoints}
        className="h-7 rounded-md border border-slate-200 bg-slate-50 px-2 text-xs font-semibold text-slate-700 outline-none transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 disabled:opacity-50"
      >
        <option value="">-</option>
        {STORY_POINTS.map((pt) => (
          <option key={pt} value={pt}>
            {pt} {t.projectsPage.backlogPage.pointShort}
          </option>
        ))}
      </select>
    </div>
  );
}
