'use client';

import Script from 'next/script';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { User } from '@supabase/supabase-js';

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

const OneTapComponent = ({
  setUser,
}: {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}) => {
  const supabase = createClient();

  const router = useRouter();

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
    let isInitialized = false;

    const initializeGoogleOneTap = async () => {
      if (isInitialized) return;
      console.log('Initializing Google One Tap');

      const [nonce, hashedNonce] = await generateNonce();
      console.log('Nonce: ', nonce, hashedNonce);

      // check if there's already an existing session
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session', error);
      }
      if (data.session) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: async (response: CredentialResponse) => {
          try {
            const { data, error } = await supabase.auth.signInWithIdToken({
              provider: 'google',
              token: response.credential,
              nonce,
            });

            if (error) throw error;
            console.log('Session data: ', data);
            console.log('Successfully logged in with Google One Tap');
            setUser(data.user);
          } catch (error) {
            console.error('Error logging in with Google One Tap', error);
          }
        },
        nonce: hashedNonce,
        use_fedcm_for_prompt: true,
        // allowed_parent_origin: window.location.origin,
      });

      window.google.accounts.id.prompt();
      isInitialized = true;
    };

    // Script가 로드된 후에 초기화
    const timer = setTimeout(initializeGoogleOneTap, 100);

    return () => {
      clearTimeout(timer);
      isInitialized = false;
    };
  }, [router, supabase.auth]);

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => console.log('Google Script loaded')}
      />
      <div id="oneTap" className="fixed top-0 right-0 z-[100]" />
    </>
  );
};

export default OneTapComponent;
