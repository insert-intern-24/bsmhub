// src/app/layout.tsx
import './globals.css';
import Header from './components/layout/header/Header';
import Footer from './components/layout/Footer';

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
    <html lang="en">
      <body className="bg-[#F5F5F7]">
        <Header />
        <main className="mt-14 w-full min-h-dvh">
          <div className="max-w-outer mx-auto">{children}</div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
