import '@/app/globals.css';
import '@/app/responsive.css';
import '@components/modal/inputs/common/common.css';
import '@components/modal/modal.css';

export const metadata = {
  title: 'BSMHub',
  description: '부산소프트웨어마이스터고 프로젝트의 장',
  image: '/favicon.ico',
};

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full min-h-dvh bg-white pt-14 mobile:pt-0">
      <div className="max-w-[109rem] mobile:p-3 min-h-screen mobile:pb-12 pb-[4rem] mx-auto">
        {children}
      </div>
    </main>
  );
}
