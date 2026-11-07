import React, { useEffect, useRef, useId } from "react";
import { X } from "lucide-react";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  disableCloseWhilePending?: boolean;
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
  disableCloseWhilePending = false,
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  // Close on Escape
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!isOpen) return;
    triggerRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (!disableCloseWhilePending) {
          onCloseRef.current();
        }
      }
      if (e.key === "Tab" && panelRef.current) {
        const items = panelRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // التعديل الجذري هنا: بدلاً من التركيز على زر الإغلاق، نبحث عن أول input أو حقل كتابة ونعطيه الفوكس بلطف
    const timer = setTimeout(() => {
      if (panelRef.current) {
        const firstInput = panelRef.current.querySelector<HTMLElement>(
          "input:not([disabled]), textarea:not([disabled]), select:not([disabled])",
        );
        if (firstInput) {
          firstInput.focus();
        } else {
          // إذا مافي حقل إدخال، بنترك التركيز عادي بدون إجبار زر الـ X
          panelRef.current.focus();
        }
      }
    }, 30);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
      triggerRef.current?.focus();
    };
  }, [disableCloseWhilePending, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-3 sm:p-4"
    >
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={() => {
          if (!disableCloseWhilePending) {
            onClose();
          }
        }}
        style={{ animation: "dialogFadeIn 0.15s ease" }}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className={`relative z-10 my-auto max-h-[calc(100dvh-1.5rem)] w-full overflow-y-auto ${maxWidthClasses[maxWidth]} rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:max-h-[calc(100dvh-2rem)] sm:p-6 outline-none`}
        style={{ animation: "dialogSlideIn 0.18s cubic-bezier(0.16,1,0.3,1)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <h3
            id={titleId}
            className="text-base font-bold text-slate-900 dark:text-slate-100"
          >
            {title}
          </h3>
          <button
            ref={closeButtonRef}
            onClick={() => {
              if (!disableCloseWhilePending) {
                onClose();
              }
            }}
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
