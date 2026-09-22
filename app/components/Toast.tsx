"use client";

import type { ToastMessage } from "@/lib/hooks/useToast";

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
}

export function Toast({ toasts, onDismiss }: ToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast" onClick={() => onDismiss(toast.id)}>
          {toast.text}
        </div>
      ))}
    </div>
  );
}
