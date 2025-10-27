'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { ModalProvider, Modal } from '@components/modal';

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
        {children}
        <Modal />
      </ModalProvider>
    </QueryClientProvider>
  );
}
