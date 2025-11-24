'use client';

import { useEffect } from 'react';
import NProgress from 'nprogress';

export default function NavigationEvents() {
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLAnchorElement;
      const href = target.href;
      const currentUrl = window.location.href;
      
      // 같은 페이지가 아니면 NProgress 시작
      if (href !== currentUrl) {
        NProgress.start();
      }
    };

    const handleMutation = () => {
      const anchors = document.querySelectorAll('a[href]');
      anchors.forEach((anchor) => {
        anchor.addEventListener('click', handleAnchorClick as EventListener);
      });
    };

    // 초기 앵커 태그에 이벤트 리스너 추가
    handleMutation();

    // DOM 변경 감지하여 새로운 앵커 태그에도 이벤트 리스너 추가
    const observer = new MutationObserver(handleMutation);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      const anchors = document.querySelectorAll('a[href]');
      anchors.forEach((anchor) => {
        anchor.removeEventListener('click', handleAnchorClick as EventListener);
      });
    };
  }, []);

  return null;
}
