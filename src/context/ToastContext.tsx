import React, { createContext, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X, Heart, ShoppingBag } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'cart' | 'wishlist';

export interface ToastMessage {
  id: string;
  title?: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: ToastType = 'success', title?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, message, type, title };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'cart':
        return <ShoppingBag className="w-4 h-4 text-gold" />;
      case 'wishlist':
        return <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-600" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />;
      case 'success':
      default:
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-20 lg:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto bg-stone-900/95 text-white backdrop-blur-md rounded-2xl p-3.5 shadow-2xl border border-stone-700/80 flex items-start gap-3 animate-fade-in-up"
          >
            <div className="mt-0.5 flex-shrink-0">{getIcon(t.type)}</div>
            <div className="flex-1 min-w-0">
              {t.title && <h4 className="text-xs font-semibold text-gold-light">{t.title}</h4>}
              <p className="text-xs text-stone-200 leading-snug">{t.message}</p>
            </div>
            <button
              type="button"
              onClick={() => removeToast(t.id)}
              className="p-1 text-stone-400 hover:text-white rounded-lg"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
