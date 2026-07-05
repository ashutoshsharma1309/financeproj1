"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastTone = "success" | "error" | "warning" | "info";
type Toast = { id: string; title: string; description?: string; tone: ToastTone };

type ToastContextValue = {
  toast: (t: Omit<Toast, "id">) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const toneClass: Record<ToastTone, string> = {
  success: "text-success",
  error: "text-danger",
  warning: "text-warning",
  info: "text-primary",
};

let counter = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const toast = React.useCallback((t: Omit<Toast, "id">) => {
    const id = `t_${counter++}`;
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 4200);
  }, []);

  const dismiss = (id: string) =>
    setToasts((prev) => prev.filter((x) => x.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {mounted &&
        createPortal(
          <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-3">
            <AnimatePresence>
              {toasts.map((t) => {
                const Icon = icons[t.tone];
                return (
                  <motion.div
                    key={t.id}
                    layout
                    initial={{ opacity: 0, x: 40, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 40, scale: 0.95 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="pointer-events-auto flex items-start gap-3 rounded-xl bg-surface p-4 shadow-clay"
                  >
                    <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", toneClass[t.tone])} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{t.title}</p>
                      {t.description && (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {t.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => dismiss(t.id)}
                      className="rounded-md p-1 text-muted-foreground hover:bg-muted"
                      aria-label="Dismiss"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
