import { useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import type { LucideIcon } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";
import { useAppStore } from "../../../store/useAppStore";

interface AuthInputProps {
  label: string;
  id: string;
  type?: string;
  icon: LucideIcon;
  error?: string;
  registration: UseFormRegisterReturn;
  autoComplete: string;
}

export function AuthInput({
  label,
  id,
  type = "text",
  icon: Icon,
  error,
  registration,
  autoComplete,
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const currentType = isPassword ? (showPassword ? "text" : "password") : type;
  const { lang } = useAppStore();
  const isRtl = lang === "ar";

  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="block text-xs font-medium text-slate-700 dark:text-slate-200"
      >
        {label}
      </label>
      <div className="relative">
        {/* أيقونة الحقل الرئيسية على اليسار (أو اليمين حسب الـ RTL) */}
        <Icon
          aria-hidden="true"
          size={16}
          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-slate-400 ${
            isRtl ? "right-3.5" : "left-3.5"
          }`}
        />

        <input
          id={id}
          type={currentType}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          {...registration}
          className={`h-11 w-full rounded-md border bg-white text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 dark:bg-slate-800 dark:text-slate-50 ${
            isRtl ? "pr-10 pl-10" : "pl-10 pr-10"
          } ${
            error
              ? "border-red-500 focus:ring-red-100 dark:focus:ring-red-950"
              : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 dark:border-slate-700 dark:focus:ring-indigo-950"
          }`}
        />

        {/* زر إظهار وإخفاء كلمة المرور (دائم لا يختفي أبداً لحقول الباسورد) */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none ${
              isRtl ? "left-3.5" : "right-3.5"
            }`}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="text-xs font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
