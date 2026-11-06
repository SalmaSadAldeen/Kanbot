// src/features/projects/components/SearchEmptyState.tsx
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
      icon={<Search size={36} className="text-slate-400 dark:text-slate-500" />}
      action={
        <Button variant="outline" onClick={onClear} className="mt-2">
          {t.projectsPage.clearSearch || "Clear search"}
        </Button>
      }
    />
  );
}
