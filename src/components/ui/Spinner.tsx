import React from "react";
import { Loader2 } from "lucide-react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  className = "",
}) => {
  const sizes = {
    sm: 16,
    md: 24,
    lg: 36,
  };

  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <Loader2
        size={sizes[size]}
        className="animate-spin text-indigo-600 dark:text-indigo-400"
      />
    </div>
  );
};
