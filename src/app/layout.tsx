import Footer from './components/layout/Footer';
import './globals.css';
import './responsive.css';
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
      <body className="bg-[#F5F5F7]">
        <ModalProvider>
          <Header />
          <main className="w-full min-h-dvh pt-[120px]">
            <div className="max-w-[109rem] min-h-screen bg-white mobile:pb-12 pb-[4rem] mx-auto">
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
