import React, { createContext, useContext, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "../../types/api.ts";
import { getMe } from "../../api/api.ts";
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

  const {
    data: user = null,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["auth-me"],
    queryFn: async () => {
      const response = await getMe();
      return response.user;
    },
    enabled: Boolean(token),
    retry: false,
    staleTime: Infinity,
  });

  const logout = () => {
    localStorage.removeItem("kanbot_token");
    queryClient.clear();
    window.location.replace("/login");
  };

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem("kanbot_token", newToken);
    queryClient.setQueryData(["auth-me"], { user: newUser });
  };

  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout();
    });
  }, []);

  useEffect(() => {
    if (isError) {
      logout();
    }
  }, [isError]);

  if (token && isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-950 text-zinc-100">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          <span className="text-xs font-medium tracking-wider text-zinc-500 uppercase">
            Initializing session...
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
