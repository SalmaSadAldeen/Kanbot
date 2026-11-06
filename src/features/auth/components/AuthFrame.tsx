import React from "react";
import { Link } from "react-router";
import {  Zap } from "lucide-react";
import { useTranslation } from "../../../store/useAppStore";

export function AuthFrame({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode: "login" | "register";
}) {
  const { t } = useTranslation();

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
              {t.brand}
            </Link>
            <div className="mb-6">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                {mode === "login"
                  ? t.authFrame.welcomeBack
                  : t.authFrame.getStarted}
              </p>
              <h1 className="m-0 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                {mode === "login"
                  ? t.authFrame.loginTitle
                  : t.authFrame.registerTitle}
              </h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {mode === "login"
                  ? t.authFrame.loginSubtitle
                  : t.authFrame.registerSubtitle}
              </p>
            </div>
            {children}
          </div>
        </section>

        {/* القسم الجانبي */}
        <aside className="relative hidden flex-1 overflow-hidden bg-indigo-600 p-12 text-white lg:flex lg:flex-col lg:justify-between dark:bg-indigo-950">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full border-[64px] border-white/10 pointer-events-none" />
          <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full border-[64px] border-white/10 pointer-events-none" />
          <div className="relative z-10 flex items-center gap-3 text-sm font-medium text-indigo-100">
            <Zap size={16} className="text-amber-300" />
            {t.authFrame.tagline}
          </div>
          <div className="relative z-10 max-w-lg py-12">
            <div className="mb-6 flex gap-2">
              <span className="h-2 w-8 rounded-full bg-white" />
              <span className="h-2 w-2 rounded-full bg-white/40" />
              <span className="h-2 w-2 rounded-full bg-white/40" />
            </div>
            <blockquote className="text-3xl xl:text-4xl font-semibold leading-tight tracking-tight">
              “{t.authFrame.quote}”
            </blockquote>
            <p className="mt-4 text-indigo-100 text-sm">
              {t.authFrame.quoteDesc}
            </p>
          </div>
          <p className="relative z-10 text-xs text-indigo-100">
            {t.authFrame.footerNote}
          </p>
        </aside>
      </div>
    </main>
  );
}
