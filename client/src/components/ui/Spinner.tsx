import React from "react";
import { Loader2 } from "lucide-react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  /** إذا بدك ياه يظهر بدون الـ div الحاضن، حطيها true */
  inline?: boolean;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  className = "",
  inline = false,
}) => {
  const sizes = {
    sm: 16,
    md: 24,
    lg: 36,
  };

  const spinnerElement = (
    <Loader2
      size={sizes[size]}
      className="animate-spin text-indigo-600 dark:text-indigo-400"
    />
  );

  // إذا كان inline أو أضفتِ كلاسات خارجية مخصصة، نرجع الأيقونة لحالها
  if (inline) {
    return (
      <span className={`inline-flex items-center ${className}`}>
        {spinnerElement}
      </span>
    );
  }

  // السلوك القديم كما هو تماماً لكي لا ينزع أي شي استخدمتيه من قبل
  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      {spinnerElement}
    </div>
  );
};
