import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Language } from "../i18n/translations";
import { translations } from "../i18n/translations";

type Theme = "light" | "dark";

interface AppState {
  theme: Theme;
  lang: Language;
  isCollapsed: boolean;
  isMobileSidebarOpen: boolean;
  lastProjectId: string | null;
  toggleTheme: () => void;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  toggleSidebar: () => void;
  closeMobileSidebar: () => void;
  setLastProjectId: (id: string | null) => void;
}

// useAppStore.ts
const applyThemeAndLang = (theme: Theme, lang: Language) => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.add("no-motion"); // يوقف كل الانتقالات
  root.classList.toggle("dark", theme === "dark");
  root.dir = lang === "ar" ? "rtl" : "ltr";
  root.lang = lang;
  // بعد ما يرسم المتصفح الفريم الجديد، نرجّع الحركة
  requestAnimationFrame(() =>
    requestAnimationFrame(() => root.classList.remove("no-motion")),
  );
};
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: "light",
      lang: "en",
      isCollapsed: false,
      isMobileSidebarOpen: false,
      lastProjectId: null,

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
        // عند تغيير اللغة نبقي السايد بار محافظاً على حالته ولا نغلقه تلقائياً
        set({ lang: nextLang });
      },

      toggleSidebar: () => {
        // التحكم بالطي والتوسيع مباشرة ليشتغل بكل الشاشات بسلاسة
        set({ isCollapsed: !get().isCollapsed });
      },

      closeMobileSidebar: () => set({ isMobileSidebarOpen: false }),
      setLastProjectId: (id: string | null) => set({ lastProjectId: id }),
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

export function useTranslation() {
  const lang = useAppStore((state) => state.lang);
  return {
    t: translations[lang] || translations.en,
    lang,
    isRtl: lang === "ar",
  };
}
