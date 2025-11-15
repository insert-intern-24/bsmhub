'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { ModalProvider, Modal } from '@/app/components/modal';
import { ToastProvider, Toast } from '@/app/components/toast';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000,
            gcTime: 5 * 60 * 1000,
            retry: 3,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <ToastProvider>
          {children}
          <Modal />
          <Toast />
        </ToastProvider>
      </ModalProvider>
    </QueryClientProvider>
  );
}
