import { MoonStar, SunMedium, Languages } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { useAppStore, useTranslation } from "../../store/useAppStore";

export function SettingsPage() {
  const { theme, lang, toggleTheme, setLanguage } = useAppStore();
  const { t } = useTranslation();

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4 md:p-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-500">
              {t.nav.settings}
            </p>
            <h1 className="mt-2 text-2xl font-black text-slate-900 dark:text-slate-100">
              Preferences
            </h1>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <SunMedium size={16} className="text-amber-500" />
              Appearance
            </div>
            <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
              Switch between light and dark mode for the full interface.
            </p>
            <Button
              onClick={toggleTheme}
              variant="outline"
              className="cursor-pointer"
            >
              {theme === "dark" ? "Switch to light" : "Switch to dark"}
            </Button>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <Languages size={16} className="text-indigo-500" />
              Language
            </div>
            <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
              Use the app in English or Arabic.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => setLanguage("en")}
                variant={lang === "en" ? "primary" : "outline"}
                className="cursor-pointer"
              >
                English
              </Button>
              <Button
                onClick={() => setLanguage("ar")}
                variant={lang === "ar" ? "primary" : "outline"}
                className="cursor-pointer"
              >
                العربية
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <MoonStar size={16} className="text-indigo-500" />
            Workspace settings
          </div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Theme and language preferences are stored in the local app state so
            the experience remains consistent across reloads.
          </p>
        </div>
      </div>
    </div>
  );
}
