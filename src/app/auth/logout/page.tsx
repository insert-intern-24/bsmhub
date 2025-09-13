'use client';

import { useEffect } from 'react';

const LogoutPage = () => {
  useEffect(() => {
    window.location.href = '/';
  }, []);
  return (
      <div className="bg-white py-5 px-8 rounded-lg">
        <h1 className="text-xl font-bold">로그아웃 중...</h1>
      </div>
  );
};

export default LogoutPage;
