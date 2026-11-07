/* eslint-disable react-refresh/only-export-components */
import React, { Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { ProtectedRoute } from "./features/auth/ProtectedRoute";
import { GuestRoute } from "./features/auth/GuestRoute";
import { AppShell } from "./components/layout/AppShell";
import { Spinner } from "./components/ui/Spinner"; // استيراد مكون السبينر الجميل تبعك

const LoginPage = React.lazy(() =>
  import("./features/auth/pages/LoginPage").then((mod) => ({
    default: mod.LoginPage,
  })),
);
const RegisterPage = React.lazy(() =>
  import("./features/auth/pages/RegisterPage").then((mod) => ({
    default: mod.RegisterPage,
  })),
);
const ProjectsPage = React.lazy(() =>
  import("./features/projects/ProjectsPage").then((mod) => ({
    default: mod.ProjectsPage,
  })),
);
const BacklogPage = React.lazy(() =>
  import("./features/backlog/BacklogPage").then((mod) => ({
    default: mod.BacklogPage,
  })),
);
const SprintsPage = React.lazy(() =>
  import("./features/sprint/SprintsPage").then((mod) => ({
    default: mod.SprintsPage,
  })),
);
const BoardPage = React.lazy(() =>
  import("./features/board/BoardPage").then((mod) => ({
    default: mod.BoardPage,
  })),
);
const SprintAnalyticsPage = React.lazy(() =>
  import("./features/analytics/SprintAnalytics").then((mod) => ({
    default: mod.SprintAnalyticsPage,
  })),
);
// استخدام الـ Spinner المخصص الخاص بكِ لضمان ثبات الشكل وعدم حدوث رجة
function RouteFallback() {
  return (
    <div className="flex min-h-[220px] w-full items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

const routeLayout = (
  <Suspense fallback={<RouteFallback />}>
    <AppShell />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      {
        path: "/login",
        element: (
          <Suspense fallback={<RouteFallback />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: "/register",
        element: (
          <Suspense fallback={<RouteFallback />}>
            <RegisterPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: routeLayout,
        children: [
          { path: "/", element: <Navigate to="/projects" replace /> },
          {
            path: "/projects",
            element: (
              <Suspense fallback={<RouteFallback />}>
                <ProjectsPage />
              </Suspense>
            ),
          },
          {
            path: "/projects/:projectId",
            element: <Navigate to="backlog" replace />,
          },
          {
            path: "/projects/:projectId/backlog",
            element: (
              <Suspense fallback={<RouteFallback />}>
                <BacklogPage />
              </Suspense>
            ),
          },
          {
            path: "/projects/:projectId/board",
            element: (
              <Suspense fallback={<RouteFallback />}>
                <BoardPage />
              </Suspense>
            ),
          },
          {
            path: "/projects/:projectId/sprints",
            element: (
              <Suspense fallback={<RouteFallback />}>
                <SprintsPage />
              </Suspense>
            ),
          },
          {
            path: "/projects/:projectId/sprints/:sprintId",
            element: (
              <Suspense fallback={<RouteFallback />}>
                <SprintsPage />
              </Suspense>
            ),
          },
          {
            path: "/projects/:projectId/analytics",
            element: (
              <Suspense fallback={<RouteFallback />}>
                <SprintAnalyticsPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
