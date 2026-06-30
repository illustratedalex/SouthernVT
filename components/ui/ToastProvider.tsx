"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type ToastTone = "success" | "info" | "warning" | "error";

type ToastMessage = {
  id: string;
  tone: ToastTone;
  title: string;
  description?: string;
};

type ToastContextValue = {
  toasts: ToastMessage[];
  pushToast: (toast: Omit<ToastMessage, "id">) => void;
  dismissToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function makeId() {
  return `toast-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const value = useMemo<ToastContextValue>(
    () => ({
      toasts,
      pushToast: (toast) => setToasts((current) => [{ id: makeId(), ...toast }, ...current].slice(0, 3)),
      dismissToast: (id) => setToasts((current) => current.filter((item) => item.id !== id)),
    }),
    [toasts],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-3 px-4 sm:px-0">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto rounded-2xl border border-[#e8dfc8] bg-white p-4 shadow-lg">
            <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
            {toast.description ? <p className="mt-1 text-sm leading-6 text-slate-600">{toast.description}</p> : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToasts() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToasts must be used within a ToastProvider");
  }

  return context;
}