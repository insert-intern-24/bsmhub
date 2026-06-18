'use client';

import { QueryClient, QueryClientProvider, MutationCache } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

interface QueryProviderProps {
  children: ReactNode;
}

// 에러 객체에 suppressToast 속성을 추가할 수 있도록 타입 확장
export interface ErrorWithSuppressToast extends Error {
  suppressToast?: boolean;
}

/**
 * QueryProvider
 * 
 * React Query의 전역 설정을 제공하는 컴포넌트입니다.
 * 
 * ## Mutation 에러 토스트 제어
 * 
 * 기본적으로 모든 mutation 에러는 자동으로 Toast를 통해 사용자에게 표시됩니다.
 * 하지만 특정 mutation에서 개별적으로 에러를 처리하고 싶은 경우, 다음 두 가지 방법으로 Toast 표시를 억제할 수 있습니다:
 * 
 * ### 방법 1: mutation meta 속성 사용
 * ```typescript
 * const mutation = useMutation({
 *   mutationFn: myMutationFn,
 *   meta: {
 *     showErrorToast: false, // Toast를 표시하지 않음
 *   },
 *   onError: (error) => {
 *     // 커스텀 에러 처리
 *   },
 * });
 * ```
 * 
 * ### 방법 2: error 객체에 suppressToast 속성 추가
 * ```typescript
 * const mutation = useMutation({
 *   mutationFn: async () => {
 *     try {
 *       return await api.call();
 *     } catch (error) {
 *       const customError = error as ErrorWithSuppressToast;
 *       customError.suppressToast = true; // Toast를 표시하지 않음
 *       throw customError;
 *     }
 *   },
 *   onError: (error) => {
 *     // 커스텀 에러 처리
 *   },
 * });
 * ```
 */

export default function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        mutationCache: new MutationCache({
          onError: (error, _variables, _context, mutation) => {
            // meta.showErrorToast가 false이거나 error.suppressToast가 true이면 토스트를 표시하지 않음
            const mutationMeta = mutation?.options?.meta;
            const shouldSuppressToast = 
              mutationMeta?.showErrorToast === false || 
              (error as ErrorWithSuppressToast).suppressToast === true;

            if (typeof window !== 'undefined' && !shouldSuppressToast) {
              const event = new CustomEvent('react-query-error', {
                detail: { error },
              });
              window.dispatchEvent(event);
            }
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: Infinity,
            gcTime: Infinity,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
