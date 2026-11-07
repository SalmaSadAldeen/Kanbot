import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#1e293b",
          color: "#f8fafc",
          fontSize: "13px",
          fontWeight: 600,
          borderRadius: "12px",
          padding: "12px 16px",
        },
        success: {
          iconTheme: {
            primary: "#10b981",
            secondary: "#f8fafc",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#f8fafc",
          },
        },
      }}
    />
  );
}
