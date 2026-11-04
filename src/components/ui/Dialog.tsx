import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

const maxWidthClasses: Record<NonNullable<DialogProps["maxWidth"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "md",
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    // Move focus to close button when dialog opens
    closeButtonRef.current?.focus();
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-3 sm:p-4"
    >
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
        style={{ animation: "dialogFadeIn 0.15s ease" }}
      />

      {/* Panel */}
      <div
        className={`relative z-10 my-auto max-h-[calc(100dvh-1.5rem)] w-full overflow-y-auto ${maxWidthClasses[maxWidth]} rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:max-h-[calc(100dvh-2rem)] sm:p-6`}
        style={{ animation: "dialogSlideIn 0.18s cubic-bezier(0.16,1,0.3,1)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <h3
            id="dialog-title"
            className="text-base font-bold text-slate-900 dark:text-slate-100"
          >
            {title}
          </h3>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Close dialog"
          >
            <X size={17} />
          </button>
        </div>

        <div className="mt-4">{children}</div>
      </div>

      {/* Keyframe animations defined inline so they don't need a plugin */}
      <style>{`
        @keyframes dialogFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes dialogSlideIn {
          from { opacity: 0; transform: scale(0.96) translateY(6px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);   }
        }
      `}</style>
    </div>
  );
};
