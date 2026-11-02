/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Primary Brand (Exact Base: #4f46e5 with full harmonious scale)
        indigo: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5", // الأساسي المعتمد لديكِ
          700: "#4338CA", // Hover
          800: "#3730A3",
          900: "#312E81",
          950: "#1E1B4B",
        },
        // Accent & Success (Exact Base: #22c55e with full harmonious scale)
        emerald: {
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          300: "#86EFAC",
          400: "#4ADE80",
          500: "#22C55E", // الأساسي المعتمد لديكِ
          600: "#16A34A", // Hover
          700: "#15803D",
          800: "#166534",
          900: "#14532D",
          950: "#052E16",
        },
        // Priorities & Statuses
        amber: {
          50: "#FFFBEB",
          500: "#F59E0B",
          700: "#B45309",
        },
        red: {
          50: "#FEF2F2",
          500: "#EF4444",
          700: "#B91C1C",
        },
        purple: {
          50: "#FAF5FF",
          600: "#9333EA",
          700: "#7C3AED",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        modal:
          "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        drawer: "-10px 0 25px -5px rgb(0 0 0 / 0.1)",
      },
    },
  },
  plugins: [],
};
