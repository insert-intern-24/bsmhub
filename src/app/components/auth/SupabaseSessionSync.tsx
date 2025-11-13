'use client';

import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

/**
 * localStorage의 Supabase 세션을 쿠키로 동기화하는 컴포넌트
 * admin-web에서 로그인한 세션을 Next.js 앱에서 사용 가능하도록 함
 */
export default function SupabaseSessionSync() {
  useEffect(() => {
    const supabase = createClient();

    const syncSession = async () => {
      try {
        const storageKey = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_KEY || 'sb-bsmhubsp-auth-token';
        const storedSession = localStorage.getItem(storageKey);

        if (!storedSession) {
          return;
        }

        // 현재 세션 확인
        const { data: { session } } = await supabase.auth.getSession();

        // 세션이 없거나 만료되었으면 localStorage에서 복원 시도
        if (!session) {
          const sessionData = JSON.parse(storedSession);
          // sessionData가 객체이며 null이 아닌지 확인
          if (typeof sessionData !== 'object' || sessionData === null) {
            console.warn('Invalid session data format in localStorage');
            return;
          }
          // access_token과 refresh_token이 모두 존재하는지 확인
          if (!sessionData.access_token || !sessionData.refresh_token) {
            console.warn('Session data missing access_token or refresh_token');
            return;
          }

          // localStorage의 세션을 Supabase에 설정
          await supabase.auth.setSession({
            access_token: sessionData.access_token,
            refresh_token: sessionData.refresh_token,
          });
        }
      } catch (error) {
        console.error('Failed to sync Supabase session:', error);
      }
    };

    // 초기 세션 동기화
    syncSession();

    // 세션 변경 감지 리스너 추가
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // 세션이 만료되거나 로그아웃될 때 재동기화 시도
      if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_OUT') {
        syncSession();
      }
    });

    // 클린업: 리스너 제거
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return null;
}
