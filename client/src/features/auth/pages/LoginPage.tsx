import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";

import { ApiError } from "../../../api/client";
import { login as loginRequest } from "../../../api/api";
import type { LoginRequest } from "../../../types/api";
import { useAuth } from "../AuthProvider";
import { loginSchema } from "../AuthSchemas";
import type { LoginFormData } from "../AuthSchemas";
import { ApiAlert } from "../components/ApiAlert"; // الاستيراد من مجلد المكونات الجديد
import { AuthInput } from "../components/AuthInput"; // الاستيراد من مجلد المكونات الجديد
import { AuthFrame } from "../components/AuthFrame"; // الاستيراد من مجلد المكونات الجديد

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [apiMessage, setApiMessage] = useState(() =>
    params.get("expired") === "1"
      ? "Your session has expired. Please log in again."
      : "",
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    setApiMessage("");
    try {
      const credentials: LoginRequest = data;
      const response = await loginRequest(credentials);
      login(response.token, response.user);
      const redirect = params.get("redirect");
      navigate(redirect?.startsWith("/") ? redirect : "/projects", {
        replace: true,
      });
    } catch (error) {
      setApiMessage(
        error instanceof ApiError
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <AuthFrame mode="login">
      <ApiAlert message={apiMessage} onDismiss={() => setApiMessage("")} />
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <AuthInput
          id="email"
          label="Email address"
          type="email"
          icon={Mail}
          autoComplete="off"
          registration={register("email")}
          error={errors.email?.message}
        />
        <AuthInput
          id="password"
          label="Password"
          type="password"
          icon={LockKeyhole}
          autoComplete="new-password"
          registration={register("password")}
          error={errors.password?.message}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-indigo-900"
        >
          {isSubmitting && (
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
            />
          )}
          {isSubmitting ? "Signing in…" : "Sign in"}
          {!isSubmitting && <ArrowRight size={17} />}
        </button>
      </form>
      <p className="mt-7 text-center text-sm text-slate-500 dark:text-slate-400">
        New to Kanbot?{" "}
        <Link
          to="/register"
          className="font-semibold text-indigo-600 hover:text-indigo-700 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          Create an account
        </Link>
      </p>
    </AuthFrame>
  );
}
