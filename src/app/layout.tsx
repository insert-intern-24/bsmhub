import Footer from './components/layout/Footer';
import './globals.css';
import './responsive.css';
import '@components/modal/inputs/common/common.css';
import '@components/modal/modal.css';
import Header from '@components/layout/Header';
import Navigator from '@components/layout/Navigator';
import Providers from './providers';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BSMHub',
  description: '부산소프트웨어마이스터고 프로젝트의 장',
  icons: {
    icon: '/favicon.ico',
  },
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
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="bg-[#F5F5F7] pt-14">
        <Providers>
          <Header />
          {children}
          <Navigator />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
