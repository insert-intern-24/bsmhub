'use client';

import OverlayBg from '@/app/components/layout/overlay/OverlayBg';
import { useEffect } from 'react';

const LogoutPage = () => {
  useEffect(() => {
    window.location.href = '/';
  }, []);
  return (
    <OverlayBg>
      <div className="bg-white py-5 px-8 rounded-lg">
        <h1 className="text-xl font-bold">로그아웃 중...</h1>
      </div>
    </OverlayBg>
  );
};

export default LogoutPage;
