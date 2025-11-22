'use client';

import { useEffect } from 'react';

const LogoutPage = () => {
  useEffect(() => {
    // localStorage에서 Supabase 세션 제거
    const storageKey = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_KEY || 'sb-bsmhubsp-auth-token';
    localStorage.removeItem(storageKey);

    // 홈으로 리다이렉트
    window.location.href = '/';
  }, []);

  return (
    <div className="bg-white py-5 px-8 rounded-lg">
      <h1 className="text-xl font-bold">로그아웃 중...</h1>
    </div>
  );
};

export default LogoutPage;
