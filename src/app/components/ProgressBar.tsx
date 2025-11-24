'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import NProgress from 'nprogress';

export default function NavigationProgressBar() {
  const pathname = usePathname();

  // NProgress 설정을 컴포넌트 마운트 시 한 번만 실행
  useEffect(() => {
    NProgress.configure({ 
      showSpinner: false,
      trickleSpeed: 200,
      minimum: 0.08,
    });
  }, []);

  // 라우트 변경 완료 시 프로그레스 바 종료
  useEffect(() => {
    NProgress.done();
  }, [pathname]);

  return null;
}
