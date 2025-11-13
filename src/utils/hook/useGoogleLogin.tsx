'use client';

import { useCallback } from 'react';

export const useGoogleLogin = () => {
  const handleGoogleLogin = useCallback(async () => {
    const popup = window.open(
      `${window.location.origin}/auth/login`,
      '_blank',
      'popup,scrollbars=yes,resizable=yes,width=500,height=800',
    );

    popup?.focus();

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data === 'success') {
        popup?.close();
        window.removeEventListener('message', handleMessage);
      }
    };
    window.addEventListener('message', handleMessage);
  }, []);

  return handleGoogleLogin;
};

