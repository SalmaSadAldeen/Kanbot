/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#EEF2FF",
          600: "#5850EC",
          700: "#4338CA",
        },
        accent: {
          50: "#ECFDF5",
          500: "#10B981",
          600: "#059669",
        },
      },
    },
  },
  plugins: [],
};
