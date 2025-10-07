// src/app/layout.tsx
import Footer from './components/layout/Footer';
import './globals.css';
import '@components/modal/inputsOfModal/common/common.css';
import '@components/modal/modal.css';
import Header from '@components/layout/Header';
import { ModalProvider, Modal } from '@components/modal';
// import Footer from '@components/layout/Footer';

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
  return (
    <html lang="ko">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=favorite,home,search,settings&display=optional"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#F5F5F7]">
        <ModalProvider >
          <Header />
          <main className="mt-14 w-full min-h-dvh">
            <div className="max-w-outer mx-auto">{children}</div>
          </main>
          <Footer />
          <Modal />
        </ModalProvider>
      </body>
    </html>
  );
}
