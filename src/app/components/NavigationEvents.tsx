'use client';

import { useEffect } from 'react';
import NProgress from 'nprogress';

export default function NavigationEvents() {
  useEffect(() => {
    // 이벤트 위임 패턴: body에 단일 리스너만 추가하여 성능 최적화 및 메모리 누수 방지
    const handleBodyClick = (e: MouseEvent) => {
      let target = e.target as HTMLElement | null;
      
      // 클릭된 요소가 <a> 태그이거나 <a> 태그의 자식 요소인 경우 <a> 태그 찾기
      while (target && target !== document.body) {
        if (target.tagName === 'A' && (target as HTMLAnchorElement).href) {
          const anchor = target as HTMLAnchorElement;
          const href = anchor.href;
          const currentUrl = window.location.href;
          
          // 외부 링크나 새 탭으로 여는 링크는 제외
          if (anchor.target === '_blank' || anchor.getAttribute('rel')?.includes('external')) {
            return;
          }
          
          // 같은 페이지가 아니면 NProgress 시작
          if (href !== currentUrl) {
            NProgress.start();
          }
          break;
        }
        target = target.parentElement;
      }
    };

    document.body.addEventListener('click', handleBodyClick);

    return () => {
      document.body.removeEventListener('click', handleBodyClick);
    };
  }, []);

  return null;
}
