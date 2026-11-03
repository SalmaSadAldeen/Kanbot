import React, { forwardRef } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, className = "", id, ...props }, ref) => {
    const inputId =
      id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-bold text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="pointer-events-none absolute start-3 text-slate-400 dark:text-slate-500">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={[
              "w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 transition-all",
              "placeholder:text-slate-400",
              "focus-visible:outline-none focus-visible:ring-2",
              "dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500",
              leftIcon ? "ps-10" : "",
              rightIcon ? "pe-10" : "",
              error
                ? "border-red-400 focus-visible:ring-red-400/30 dark:border-red-500 dark:focus-visible:ring-red-500/30"
                : "border-slate-200 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20 dark:border-slate-700 dark:focus-visible:border-indigo-500 dark:focus-visible:ring-indigo-500/20",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          />
          {rightIcon && (
            <span className="pointer-events-none absolute end-3 text-slate-400 dark:text-slate-500">
              {rightIcon}
            </span>
          )}
        </div>
        {error && (
          <p role="alert" className="text-xs font-medium text-red-500 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
