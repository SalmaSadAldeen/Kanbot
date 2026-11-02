import type { UseFormRegisterReturn } from "react-hook-form";

interface ProjectDescriptionFieldProps {
  label: string;
  placeholder: string;
  maxLength: number;
  value: string;
  disabled?: boolean;
  error?: string;
  registration: UseFormRegisterReturn;
}

export function ProjectDescriptionField({
  label,
  placeholder,
  maxLength,
  value,
  disabled,
  error,
  registration,
}: ProjectDescriptionFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <textarea
        rows={3}
        maxLength={maxLength}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
        {...registration}
      />
      <div className="flex justify-between text-[11px] text-slate-400">
        <span>
          {value.length}/{maxLength}
        </span>
        {error && <span className="text-red-500 font-medium">{error}</span>}
      </div>
    </div>
  );
}
