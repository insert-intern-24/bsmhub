'use client';

import { createContext, useContext, useState, ReactNode, useCallback, useRef } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  title?: string;
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (message: string, type?: ToastType, duration?: number, title?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration: number = 3000, title?: string) => {
      // 기존 타이머 정리
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      const id = `${Date.now()}-${Math.random()}`;
      const newToast: ToastItem = { id, message, type, duration, title };

      // 기존 토스트를 모두 제거하고 새로운 토스트 하나만 표시
      // ToastItem 컴포넌트에서 애니메이션과 함께 자동으로 제거하므로 여기서는 제거하지 않음
      setToasts([newToast]);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

