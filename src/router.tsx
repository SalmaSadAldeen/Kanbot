import { createBrowserRouter, Navigate } from "react-router";
import { ProtectedRoute } from "./features/auth/ProtectedRoute";
import { GuestRoute } from "./features/auth/GuestRoute";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { RegisterPage } from "./features/auth/pages/RegisterPage";
import { AppShell } from "./components/layout/AppShell"; // استيراد الهيكل العام
import { ProjectsPage } from "./features/projects/ProjectsPage";
import { BacklogPage } from "./features/backlog/BacklogPage";
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
        element: <AppShell />,
        children: [
          {
            path: "/",
            element: <Navigate to="/projects" replace />,
          },
          {
            path: "/projects",
            element: <ProjectsPage />,
          },
          // المسارات الفرعية الخاصة بالمشروع المعين
          {
            path: "/projects/:projectId",
            element: <ProjectsPage />,
          },
          {
            path: "/projects/:projectId/backlog",
            element: <BacklogPage />,
          },
          {
            path: "/projects/:projectId/active-sprint",
            element: <div className="p-4">Active Sprint Page</div>,
          },
          {
            path: "/projects/:projectId/sprints",
            element: <div className="p-4">Sprints Page</div>,
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
