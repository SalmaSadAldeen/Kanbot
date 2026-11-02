import React from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { CircleAlert, Mail } from "lucide-react";

export function AuthFrame({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode: "login" | "register";
}) {
  return (
    <main className="h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50">
      <div className="flex h-full w-full flex-col lg:flex-row overflow-hidden">
        {/* قسم الفورم */}
        <section className="flex flex-1 items-center justify-center px-5 py-6 sm:px-10 lg:px-14 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="w-full max-w-md my-auto">
            <Link
              to="/login"
              className="mb-6 inline-flex items-center gap-2.5 rounded-md text-lg font-bold tracking-tight text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 dark:text-white dark:focus-visible:ring-indigo-900"
            >
              <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-indigo-600/10 dark:bg-indigo-950/50">
                <img
                  src="/kanbot-icon.png"
                  alt="Kanbot Logo"
                  className="h-12 w-12 object-contain"
                />
              </span>
              Kanbot
            </Link>
            <div className="mb-6">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-indigo-600">
                {mode === "login" ? "Welcome back" : "Get started"}
              </p>
              <h1 className="m-0 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                {mode === "login" ? "Sign in to Kanbot" : "Create your account"}
              </h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {mode === "login"
                  ? "Pick up where you left off and keep your sprint moving."
                  : "Plan your work, track your sprint, and make progress."}
              </p>
            </div>
            {children}
          </div>
        </section>

        {/* القسم الجانبي */}
        <aside className="relative hidden flex-1 overflow-hidden bg-indigo-600 p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full border-[64px] border-white/10" />
          <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full border-[64px] border-white/10" />
          <div className="relative z-10 flex items-center gap-3 text-sm font-medium text-indigo-100">
            Your sprint, in focus
          </div>
          <div className="relative z-10 max-w-lg py-12">
            <div className="mb-6 flex gap-2">
              <span className="h-2 w-8 rounded-full bg-white" />
              <span className="h-2 w-2 rounded-full bg-white/40" />
              <span className="h-2 w-2 rounded-full bg-white/40" />
            </div>
            <blockquote className="text-3xl xl:text-4xl font-semibold leading-tight tracking-tight">
              “A clearer plan makes room for better work.”
            </blockquote>
            <p className="mt-4 text-indigo-100 text-sm">
              Keep your backlog tidy, your sprint realistic, and your next step
              obvious.
            </p>
          </div>
          <p className="relative z-10 text-xs text-indigo-100">
            Simple project planning for the work that matters.
          </p>
        </aside>
      </div>
    </main>
  );
}

export function ApiAlert({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="mb-4 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
    >
      <CircleAlert className="mt-0.5 shrink-0" size={18} />
      <span className="flex-1">{message}</span>
      <button
        aria-label="Dismiss error"
        type="button"
        onClick={onDismiss}
        className="rounded text-red-700 hover:text-red-900 focus-visible:outline-none"
      >
        ×
      </button>
    </div>
  );
}

export function AuthInput({
  label,
  id,
  type = "text",
  icon: Icon,
  error,
  registration,
  autoComplete,
}: {
  label: string;
  id: string;
  type?: string;
  icon: typeof Mail;
  error?: string;
  registration: ReturnType<ReturnType<typeof useForm>["register"]>;
  autoComplete: string;
}) {
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
          // تم استخدام "new-password" أو قيم عشوائية تمنع المتصفح من إظهار الإيميلات المحفوظة القديمة
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
