import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { FieldPath } from "react-hook-form";
import { ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react";

import { ApiError } from "../../../api/client";
import { register as registerRequest } from "../../../api/auth";
import type { RegisterRequest } from "../../../types/api";
import { useAuth } from "../AuthProvider";
import { registerSchema } from "../AuthSchemas";
import type { RegisterFormData } from "../AuthSchemas";
import { ApiAlert } from "../components/ApiAlert"; // الاستيراد من مجلد المكونات الجديد
import { AuthInput } from "../components/AuthInput"; // الاستيراد من مجلد المكونات الجديد
import { AuthFrame } from "../components/AuthFrame"; // الاستيراد من مجلد المكونات الجديد

export function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [apiMessage, setApiMessage] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setApiMessage("");
    const payload: RegisterRequest = {
      name: data.name,
      email: data.email,
      password: data.password,
    };
    try {
      const response = await registerRequest(payload);
      login(response.token, response.user);
      navigate("/projects", { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 409) {
          setError("email", {
            type: "server",
            message: "An account with this email already exists",
          });
        }
        for (const detail of error.details ?? []) {
          const path = detail.path as FieldPath<RegisterFormData>;
          if (path in data) setError(path, { type: "server", message: detail.message });
        }
        setApiMessage(error.message);
      } else {
        setApiMessage("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <AuthFrame mode="register">
      <ApiAlert message={apiMessage} onDismiss={() => setApiMessage("")} />
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AuthInput
          id="name"
          label="Full name"
          icon={UserRound}
          autoComplete="name"
          registration={register("name")}
          error={errors.name?.message}
        />
        <AuthInput
          id="email"
          label="Email address"
          type="email"
          icon={Mail}
          autoComplete="email"
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
        <AuthInput
          id="confirmPassword"
          label="Confirm password"
          type="password"
          icon={LockKeyhole}
          autoComplete="new-password"
          registration={register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-indigo-900"
        >
          {isSubmitting && (
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
            />
          )}
          {isSubmitting ? "Creating account…" : "Create account"}
          {!isSubmitting && <ArrowRight size={17} />}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-indigo-600 hover:text-indigo-700 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          Sign in
        </Link>
      </p>
      <p className="mt-4 text-center text-xs text-slate-400">
        By creating an account, you agree to use Kanbot responsibly.
      </p>
    </AuthFrame>
  );
}
