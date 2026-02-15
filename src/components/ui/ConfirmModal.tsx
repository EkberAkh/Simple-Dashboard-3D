import React, { useEffect, useRef, useCallback } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "./Button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning";
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  variant = "danger",
  isLoading = false,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const getFocusableElements = useCallback(() => {
    if (!contentRef.current) return [];
    return Array.from(
      contentRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement;

    requestAnimationFrame(() => {
      const focusable = getFocusableElements();
      if (focusable.length > 0) focusable[focusable.length - 1].focus();
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const focusable = getFocusableElements();
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose, getFocusableElements]);

  if (!isOpen) return null;

  const iconColor = variant === "danger" ? "text-red-400" : "text-amber-400";
  const iconBg = variant === "danger" ? "bg-red-500/10" : "bg-amber-500/10";

  return (
    <div
      ref={overlayRef}
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[3px] p-3 sm:p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-message"
    >
      <div
        ref={contentRef}
        className="modal-content bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X size={16} />
        </button>

        <div className="px-4 pt-5 pb-4 sm:px-6 sm:pt-6 sm:pb-5 flex flex-col items-center text-center">
          <div
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full ${iconBg} flex items-center justify-center mb-3 sm:mb-4`}
          >
            <AlertTriangle size={22} className={`${iconColor} sm:hidden`} />
            <AlertTriangle
              size={24}
              className={`${iconColor} hidden sm:block`}
            />
          </div>
          <h3
            id="confirm-title"
            className="text-sm sm:text-base font-semibold text-slate-900 mb-1"
          >
            {title}
          </h3>
          <p
            id="confirm-message"
            className="text-xs sm:text-sm text-slate-500 leading-relaxed"
          >
            {message}
          </p>
        </div>

        <div className="px-4 pb-4 sm:px-6 sm:pb-5 flex gap-2 sm:gap-3">
          <Button
            variant="secondary"
            size="md"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="danger"
            size="md"
            className="flex-1"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
