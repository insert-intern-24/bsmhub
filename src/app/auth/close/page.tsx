'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GoogleCallback() {
  const router = useRouter();
  
  useEffect(() => {
    if (window.opener && !window.opener.closed) {
      window.opener.postMessage('success', window.location.origin);
    }
    // 팝업 창 닫기
    window.close();
    
    // 메인 페이지로 리다이렉트 (팝업이 아닌 경우)
    if (!window.opener) {
      router.push('/');
    }
  }, [router]);
  
  return null;
}