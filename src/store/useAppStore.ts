import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Language } from "../i18n/translations";
import { translations } from "../i18n/translations";

type Theme = "light" | "dark";

interface AppState {
  theme: Theme;
  lang: Language;
  isCollapsed: boolean;
  toggleTheme: () => void;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  toggleSidebar: () => void;
}

const applyThemeAndLang = (theme: Theme, lang: Language) => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  root.dir = lang === "ar" ? "rtl" : "ltr";
  root.lang = lang;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: "light",
      lang: "en",
      isCollapsed: false,

      toggleTheme: () => {
        const nextTheme = get().theme === "light" ? "dark" : "light";
        applyThemeAndLang(nextTheme, get().lang);
        set({ theme: nextTheme });
      },

      setLanguage: (lang: Language) => {
        applyThemeAndLang(get().theme, lang);
        set({ lang });
      },

      toggleLanguage: () => {
        const nextLang = get().lang === "en" ? "ar" : "en";
        applyThemeAndLang(get().theme, nextLang);
        set({ lang: nextLang });
      },

      toggleSidebar: () => {
        set({ isCollapsed: !get().isCollapsed });
      },
    }),
    {
      name: "kanbot_settings",
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyThemeAndLang(state.theme, state.lang);
        }
      },
    },
  ),
);

// استخراج الـ Hook بشكل صريح ومستقل تماماً
export function useTranslation() {
  const lang = useAppStore((state) => state.lang);
  return {
    t: translations[lang] || translations.en,
    lang,
    isRtl: lang === "ar",
  };
}
