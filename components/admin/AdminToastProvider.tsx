'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────
export type ToastVariant = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant) => void;
}

// ── Context ────────────────────────────────────────────────────────────────────
const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

export function useAdminToast() {
  return useContext(ToastContext);
}

// ── Single toast item ──────────────────────────────────────────────────────────
function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const showTimer = requestAnimationFrame(() => setVisible(true));
    // Auto-dismiss after 3.5s
    const dismissTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(toast.id), 350); // wait for fade-out
    }, 3500);
    return () => {
      cancelAnimationFrame(showTimer);
      clearTimeout(dismissTimer);
    };
  }, [toast.id, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />,
    info: <Info className="w-4 h-4 text-blue-400 shrink-0" />,
  };

  const borders = {
    success: 'border-l-emerald-500',
    error: 'border-l-red-500',
    info: 'border-l-blue-500',
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.96)',
      }}
      className={`flex items-center gap-3 w-full max-w-sm pl-4 pr-3 py-3.5 rounded-2xl bg-[#1a2133] border border-white/10 border-l-4 shadow-2xl ${borders[toast.variant]}`}
    >
      {icons[toast.variant]}
      <p className="text-xs font-semibold text-white flex-1 leading-snug">{toast.message}</p>
      <button
        type="button"
        onClick={() => {
          setVisible(false);
          setTimeout(() => onDismiss(toast.id), 350);
        }}
        className="shrink-0 p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ── Provider ───────────────────────────────────────────────────────────────────
export function AdminToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counterRef = useRef(0);

  const showToast = useCallback((message: string, variant: ToastVariant = 'success') => {
    counterRef.current += 1;
    const id = `toast-${Date.now()}-${counterRef.current}`;
    setToasts((prev) => [...prev, { id, message, variant }]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Fixed toast stack — bottom-right corner */}
      <div
        aria-label="Notifications"
        className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5 items-end pointer-events-none"
      >
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto w-full">
            <ToastItem toast={toast} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
