import { createBrowserRouter, Navigate } from "react-router";
import { ProtectedRoute } from "./features/auth/ProtectedRoute";
import { GuestRoute } from "./features/auth/GuestRoute";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { RegisterPage } from "./features/auth/pages/RegisterPage";
import { AppShell } from "./components/layout/AppShell"; // استيراد الهيكل العام
import { ProjectsPage } from "./features/projects/ProjectsPage";

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />, // AppShell يلتف حول كل الصفحات المحمية
        children: [
          {
            path: "/",
            element: <Navigate to="/projects" replace />, // إعادة توجيه من الرئيسية إلى المشاريع
          },
          {
            path: "/projects",
            element: <ProjectsPage />,
          },
          {
            path: "/dashboard",
            element: <ProjectsPage />,
          },
          {
            path: "/tasks",
            element: <div className="p-4">My Tasks</div>,
          },
          {
            path: "/settings",
            element: <div className="p-4">Settings</div>,
          },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
