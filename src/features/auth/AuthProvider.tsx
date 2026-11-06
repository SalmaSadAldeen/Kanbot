import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "../../types/api.ts";
import { getMe } from "../../api/auth.ts";
import { setUnauthorizedHandler } from "../../api/client";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem("kanbot_token");

  const { data: user = null, isLoading } = useQuery({
    queryKey: ["auth-me"],
    queryFn: async () => {
      const response = await getMe();
      return response.user;
    },
    enabled: Boolean(token),
    retry: 1,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const logout = useCallback(() => {
    localStorage.removeItem("kanbot_token");
    queryClient.clear();
    window.location.replace("/login");
  }, [queryClient]);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem("kanbot_token", newToken);
    queryClient.setQueryData(["auth-me"], newUser);
  };

  // معالجة انتهاء الجلسة وإبلاغ المستخدم بوضوح عبر expired=1
  useEffect(() => {
    setUnauthorizedHandler(() => {
      localStorage.removeItem("kanbot_token");
      queryClient.clear();

      const currentRedirect = `${window.location.pathname}${window.location.search}${window.location.hash}`;

      // إذا لم نكن أصلاً في صفحة اللوجن، نقوم بالتوجيه مع إعلامه بانتهاء الجلسة
      if (!window.location.pathname.includes("/login")) {
        window.location.replace(
          `/login?redirect=${encodeURIComponent(currentRedirect)}&expired=1`,
        );
      }
    });
  }, [queryClient]);

  if (token && isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          <span className="text-xs font-medium tracking-widest uppercase text-slate-500 dark:text-slate-400">
            Loading…
          </span>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
