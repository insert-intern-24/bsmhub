import Footer from './components/layout/Footer';
import './globals.css';
import './responsive.css';
import '@components/modal/inputs/common/common.css';
import '@components/modal/modal.css';
import Header from '@components/layout/Header';
import { ModalProvider, Modal } from '@components/modal';

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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="bg-white">
        <ModalProvider>
          <Header />
          <main className="w-full min-h-dvh pt-[4.5rem]">
            <div className="p-white-space-margin mobile:px-[0.6875rem] mobile:pb-12 pb-[4rem]">
              {children}
            </div>
          </main>
          <Footer />
          <Modal />
        </ModalProvider>
      </body>
    </html>
  );
}
