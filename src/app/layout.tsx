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
import Navigator from '@components/layout/Navigator';

export const metadata = {
  title: 'BSMHub',
  description: '부산소프트웨어마이스터고 프로젝트의 장',
  image: '/favicon.ico',
};

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
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="bg-[#F5F5F7] pt-14">
        <ModalProvider>
          <Header />
          {children}
          <Navigator />
          <Footer />
          <Modal />
        </ModalProvider>
      </body>
    </html>
  );
}
