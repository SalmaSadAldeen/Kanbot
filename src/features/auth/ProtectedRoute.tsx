import React from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "./AuthProvider";

export const ProtectedRoute: React.FC = () => {
  const { token, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;

  if (!token) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(`${location.pathname}${location.search}${location.hash}`)}`} replace />;
  }

  return <Outlet />;
};
