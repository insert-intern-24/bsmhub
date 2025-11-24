import Footer from './components/layout/footer/Footer';
import './globals.css';
import './responsive.css';
import '@/global.scss';
import '@/app/components/modal/inputs/common/common.css';
import '@/app/components/modal/modal.css';
import Header from '@/app/components/layout/header/Header';
import { ModalProvider, Modal } from '@/app/components/modal';
import { ToastProvider, Toast } from '@/app/components/toast';
import QueryProvider from './providers/QueryProvider';
import ErrorHandler from './providers/ErrorHandler';
import Navigator from '@/app/components/layout/header/Navigator';
import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';
import GoogleOneTab from '@/app/components/feature/auth/GoogleOneTab';
import SupabaseSessionSync from './components/feature/auth/SupabaseSessionSync';
import BusinessCardHolder from './components/card/home/BusinessCardHolder';
import NavigationProgressBar from './components/ProgressBar';
import NavigationEvents from './components/NavigationEvents';

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
    /*
      suppressHydrationWarning: NProgress 등 클라이언트 전용 컴포넌트(NavigationProgressBar, NavigationEvents)로 인해
      서버와 클라이언트 렌더링 결과가 일치하지 않는 hydration 경고를 억제합니다.
    */
    <html lang="ko" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''} />
      </head>
      <body className="bg-[#F5F5F7] pt-14">
        <NavigationProgressBar />
        <NavigationEvents />
        <QueryProvider>
          <ModalProvider>
            <ToastProvider>
              <ErrorHandler>
                <Header />
                <GoogleOneTab />
                <SupabaseSessionSync />
                {children}
                <Navigator />
                <Footer />
                <BusinessCardHolder />
                <Modal />
                <Toast />
              </ErrorHandler>
            </ToastProvider>
          </ModalProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
