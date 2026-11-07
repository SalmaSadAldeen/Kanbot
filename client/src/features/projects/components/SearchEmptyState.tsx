import { Search } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { EmptyState } from "../../../components/ui/EmptyState";
import { useTranslation } from "../../../store/useAppStore";

interface SearchEmptyStateProps {
  onClear: () => void;
}

export function SearchEmptyState({ onClear }: SearchEmptyStateProps) {
  const { t } = useTranslation();
  return (
    <EmptyState
      title={t.projectsPage.searchEmptyTitle || "No projects found"}
      description={
        t.projectsPage.searchEmptyDesc || "No projects match your search query."
      }
      icon={
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-500/20 dark:bg-indigo-950/60 dark:text-indigo-400 dark:ring-indigo-400/20">
          <Search size={26} />
        </div>
      }
      action={
        <Button
          onClick={onClear}
          className="mt-3 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-700 active:scale-95 dark:bg-indigo-600 dark:hover:bg-indigo-500 cursor-pointer"
        >
          {t.projectsPage.clearSearch || "Clear search"}
        </Button>
      }
    />
  );
}
