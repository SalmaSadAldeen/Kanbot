import React from "react";
import { FolderOpen } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = <FolderOpen size={40} className="text-indigo-500" />,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-12 text-center dark:border-slate-700 dark:bg-slate-900/20">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 shadow-inner dark:bg-indigo-950/50">
        {icon}
      </div>
      <h4 className="mt-4 text-base font-bold text-slate-800 dark:text-slate-200">
        {title}
      </h4>
      <p className="mt-1 max-w-sm text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};
