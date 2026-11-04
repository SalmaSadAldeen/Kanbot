import { createBrowserRouter, Navigate } from "react-router";
import { ProtectedRoute } from "./features/auth/ProtectedRoute";
import { GuestRoute } from "./features/auth/GuestRoute";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { RegisterPage } from "./features/auth/pages/RegisterPage";
import { AppShell } from "./components/layout/AppShell"; // استيراد الهيكل العام
import { ProjectsPage } from "./features/projects/ProjectsPage";
import { BacklogPage } from "./features/backlog/BacklogPage";
import  { SprintsPage } from "./features/sprint/SprintsPage";
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
            element: <Navigate to="backlog" replace />,
          },
          {
            path: "/projects/:projectId/backlog",
            element: <BacklogPage />,
          },
          {
            path: "/projects/:projectId/board",
            element: <div className="p-4">Board Page (Day 5)</div>,
          },
          {
            path: "/projects/:projectId/sprints",
            element: <SprintsPage />,
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
