import { useEffect } from 'react';
import { useToast } from '@/app/components/toast';

/**
 * 에러 메시지를 Toast로 표시하는 커스텀 훅
 * @param error - 표시할 에러 메시지 (null이면 표시하지 않음)
 */
export const useErrorToast = (error: string | null) => {
  const { showToast } = useToast();

  useEffect(() => {
    if (error) {
      showToast(error, 'error', 2000, '오류');
    }
  }, [error, showToast]);
};
