'use client';

import { useEffect } from 'react';
import { useToast } from '@/app/components/toast';

interface ErrorHandlerProps {
  children: React.ReactNode;
}

const ErrorHandler = ({ children }: ErrorHandlerProps) => {
  const { showToast } = useToast();

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const errorMessage = event.error?.message || event.message || '알 수 없는 오류가 발생했습니다.';
      showToast(errorMessage, 'error', 2000, '오류');
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      const errorMessage = event.reason?.message || String(event.reason) || '알 수 없는 오류가 발생했습니다.';
      showToast(errorMessage, 'error', 2000, '오류');
    };

    const handleReactQueryError = (event: CustomEvent) => {
      const error = event.detail?.error;
      const errorMessage = error?.message || String(error) || '요청 처리 중 오류가 발생했습니다.';
      showToast(errorMessage, 'error', 2000, '오류');
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);
    window.addEventListener('react-query-error', handleReactQueryError as EventListener);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
      window.removeEventListener('react-query-error', handleReactQueryError as EventListener);
    };
  }, [showToast]);

  return <>{children}</>;
};

export default ErrorHandler;

