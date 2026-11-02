import React, { forwardRef } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, leftIcon, rightIcon, className = "", id, ...props },
    ref,
  ) => {
    const inputId =
      id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

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
            <span className="absolute start-3.5 text-slate-400 dark:text-slate-500">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 dark:bg-slate-900 dark:text-slate-100 ${
              leftIcon ? "ps-10" : ""
            } ${rightIcon ? "pe-10" : ""} ${
              error
                ? "border-red-500 focus-visible:ring-red-500/30 dark:border-red-500"
                : "border-slate-200 focus-border-indigo-600 focus-visible:ring-indigo-500/20 dark:border-slate-800 dark:focus-border-indigo-500"
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <span className="absolute end-3.5 text-slate-400 dark:text-slate-500">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <p className="text-xs font-medium text-red-500">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
