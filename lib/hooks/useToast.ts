import { useCallback, useRef, useState } from "react";

export interface ToastMessage {
  id: number;
  text: string;
}

const AUTO_DISMISS_MS = 3000;

// Minimal toast queue: call `notify(text)` to show a message, which
// clears itself after a few seconds (or immediately on click).
export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback(
    (text: string) => {
      const id = nextId.current++;
      setToasts((current) => [...current, { id, text }]);
      setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
    },
    [dismiss],
  );

  return { toasts, notify, dismiss };
}
