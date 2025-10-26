'use client';

import Footer from './components/layout/Footer';
import './globals.css';
import './responsive.css';
import '@components/modal/inputs/common/common.css';
import '@components/modal/modal.css';
import Header from '@components/layout/Header';
import { ModalProvider, Modal } from '@components/modal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            retry: 3,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>BSMHub</title>
        <meta
          name="description"
          content="부산소프트웨어마이스터고 프로젝트의 장"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-[#F5F5F7]">
        <QueryClientProvider client={queryClient}>
          <ModalProvider>
            <Header />
            {children}
            <Footer />
            <Modal />
          </ModalProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
