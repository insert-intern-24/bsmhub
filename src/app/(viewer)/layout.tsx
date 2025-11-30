import '@/app/globals.css';
import '@/app/responsive.css';
import '@/app/components/modal/inputs/common/common.css';
import '@/app/components/modal/modal.css';

export const metadata = {
    title: '부산소프트웨어마이스터고 프로젝트의 장',
    description: '부산소프트웨어마이스터고 포트폴리오 사이트',
    image: '/favicon.ico',
  };

export default function BoxLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full min-h-dvh pt-4 mt-14 mobile:mt-0 mobile:pt-0">
      <div className="max-w-[109rem] px-[2.75rem] bg-white mobile:p-3 min-h-screen mobile:pb-12 pb-[4rem] mx-auto pt-[4.5rem]">
        {children}
      </div>
    </main>
  );
}
