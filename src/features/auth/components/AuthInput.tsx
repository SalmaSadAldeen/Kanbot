import type { UseFormRegisterReturn } from "react-hook-form";
import type { LucideIcon } from "lucide-react";

interface AuthInputProps {
  label: string;
  id: string;
  type?: string;
  icon: LucideIcon;
  error?: string;
  registration: UseFormRegisterReturn;
  autoComplete: string;
}

export function AuthInput({
  label,
  id,
  type = "text",
  icon: Icon,
  error,
  registration,
  autoComplete,
}: AuthInputProps) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="block text-xs font-medium text-slate-700 dark:text-slate-200"
      >
        {label}
      </label>
      <div className="relative">
        <Icon
          aria-hidden="true"
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          id={id}
          type={type}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          {...registration}
          className={`h-11 w-full rounded-md border bg-white pl-10 pr-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 dark:bg-slate-800 dark:text-slate-50 ${
            error
              ? "border-red-500 focus:ring-red-100 dark:focus:ring-red-950"
              : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 dark:border-slate-700 dark:focus:ring-indigo-950"
          }`}
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="text-xs font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
