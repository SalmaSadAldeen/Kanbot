import React from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "./AuthProvider";

export const ProtectedRoute: React.FC = () => {
  const { token, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;

  if (!token) {
    // دمج المسار الحالي مع البارامترات والهاش لتخزينه كاملاً
    const fullRedirectPath = `${location.pathname}${location.search}${location.hash}`;
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(fullRedirectPath)}`}
        replace
      />
    );
  }

  return <Outlet />;
};
