import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom"], // يمنع تكرار نسخ React ويحل مشكلة الـ Hooks نهائياً
  },
  optimizeDeps: {
    include: ["react", "react-dom", "zustand"],
  },
});
