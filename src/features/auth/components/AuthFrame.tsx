import React from "react";
import { Link } from "react-router";
import { CheckCircle2, Layers, Zap } from "lucide-react";

interface AuthFrameProps {
  children: React.ReactNode;
  mode: "login" | "register";
}

export function AuthFrame({ children, mode }: AuthFrameProps) {
  return (
    <main className="h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50">
      <div className="flex h-full w-full flex-col lg:flex-row overflow-hidden">
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
                  className="h-10 w-10 object-contain"
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

        {/* القسم الجانبي (مصمم بخصوصية إدارة المشاريع ليلائم فكرة Kanbot) */}
        <aside className="relative hidden flex-1 overflow-hidden bg-indigo-600 p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full border-[64px] border-white/10 pointer-events-none" />
          <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full border-[64px] border-white/10 pointer-events-none" />

          <div className="relative z-10 flex items-center gap-2 text-sm font-medium text-indigo-100">
            <Zap size={16} className="text-amber-300" />
            Enterprise Agile Workspace
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
            <p className="mt-4 text-indigo-100 text-sm leading-relaxed">
              Keep your backlog tidy, your sprints realistic, and your team's
              next step completely obvious with Kanbot boards.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 pt-6 border-t border-indigo-500/50">
              <div className="flex items-center gap-2 text-xs text-indigo-100">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>Real-time Task Tracking</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-indigo-100">
                <Layers size={16} className="text-emerald-400 shrink-0" />
                <span>Modular Board Views</span>
              </div>
            </div>
          </div>

          <p className="relative z-10 text-xs text-indigo-200">
            Simple project planning for the work that matters.
          </p>
        </aside>
      </div>
    </main>
  );
}
