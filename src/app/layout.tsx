// src/app/layout.tsx
import './globals.css';
import Header from '@components/layout/Header';
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
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=favorite,home,search,settings"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#F5F5F7]">
        <Header />
        <main className="mt-14 w-full min-h-dvh">
          <div className="max-w-outer mx-auto">{children}</div>
        </main>
      </body>
    </html>
  );
}
