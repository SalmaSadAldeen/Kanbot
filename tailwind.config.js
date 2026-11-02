/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors (Indigo & Blue Slate)
        indigo: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1",
          600: "#5850EC", // Primary Main Brand
          700: "#4338CA", // Primary Hover
          800: "#3730A3",
          900: "#312E81",
          950: "#1E1B4B",
        },
        // Accent Colors (Emerald - AI & Active Indicators)
        emerald: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981", // Accent Main
          600: "#059669", // Accent Hover
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
          950: "#022C22",
        },
        // Priorities & Statuses (Badges & Highlights)
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
