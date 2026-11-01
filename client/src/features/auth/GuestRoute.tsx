import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "./AuthProvider";

export const GuestRoute: React.FC = () => {
  const { token, isLoading } = useAuth();

  if (isLoading) return null;

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
