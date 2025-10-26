'use client';

import Script from 'next/script';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// google 전역 객체에 대한 타입 정의
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: unknown) => void;
          prompt: () => void;
        };
      };
    };
  }
}

interface CredentialResponse {
  credential: string;
  select_by: string;
}

const OneTapComponent = () => {
  const supabase = createClient();
  const router = useRouter();
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  const generateNonce = async (): Promise<string[]> => {
    const nonce = btoa(
      String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))),
    );
    const encoder = new TextEncoder();
    const encodedNonce = encoder.encode(nonce);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedNonce = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    return [nonce, hashedNonce];
  };

  useEffect(() => {
    if (!isGoogleLoaded) return;

    const initializeGoogleOneTap = () => {
      console.log('Initializing Google One Tap');

      // check if there's already an existing session
      supabase.auth.getSession().then(({ data, error }) => {
        if (error) {
          console.error('Error getting session', error);
        }
        if (data.session) {
          return;
        }

        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'your-client-id-here',
          callback: async (response: CredentialResponse) => {
            try {
              const { data, error } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: response.credential,
              });

              if (error) throw error;
              console.log('Session data: ', data);
              console.log('Successfully logged in with Google One Tap');
              
              // 로그인 성공 시 Account 컴포넌트가 자동으로 업데이트됨 (onAuthStateChange)
            } catch (error) {
              console.error('Error logging in with Google One Tap', error);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.prompt();
      });
    };

    // Google 스크립트가 로드된 후 약간의 지연을 두고 초기화
    const timer = setTimeout(initializeGoogleOneTap, 100);
    return () => clearTimeout(timer);
  }, [isGoogleLoaded, supabase.auth]);

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Google Script loaded');
          setIsGoogleLoaded(true);
        }}
      />
      <div id="oneTap" className="fixed top-0 right-0 z-[100]" />
    </>
  );
};

export default OneTapComponent;