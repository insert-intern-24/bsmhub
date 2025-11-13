'use client';

import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

/**
 * Supabase 세션을 쿠키와 localStorage 간 양방향 동기화하는 컴포넌트
 * - admin-web(localStorage) ↔ bsmhub(cookie) 세션 공유
 */
export default function SupabaseSessionSync() {
  useEffect(() => {
    const syncSession = async () => {
      try {
        const storageKey = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_KEY || 'sb-bsmhubsp-auth-token';
        const supabase = createClient();

        // 현재 세션 확인 (쿠키에서 읽음)
        const { data: { session } } = await supabase.auth.getSession();
        const storedSession = localStorage.getItem(storageKey);

        // Case 1: localStorage만 있고 쿠키에 세션 없음 → localStorage → 쿠키 동기화
        if (storedSession && !session) {
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

          await supabase.auth.setSession({
            access_token: sessionData.access_token,
            refresh_token: sessionData.refresh_token,
          });
          return;
        }

        // Case 2: 쿠키에 세션 있고 localStorage 없음 → 쿠키 → localStorage 동기화
        if (session && !storedSession) {
          localStorage.setItem(storageKey, JSON.stringify({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            expires_at: session.expires_at,
            expires_in: session.expires_in,
            token_type: session.token_type,
            user: session.user,
          }));
          return;
        }

        // Case 3: 둘 다 있음 → 세션 업데이트 시 localStorage도 업데이트
        if (session) {
          const storedData = storedSession ? JSON.parse(storedSession) : null;
          // access_token이 다르면 업데이트 (토큰 갱신됨)
          if (!storedData || storedData.access_token !== session.access_token) {
            localStorage.setItem(storageKey, JSON.stringify({
              access_token: session.access_token,
              refresh_token: session.refresh_token,
              expires_at: session.expires_at,
              expires_in: session.expires_in,
              token_type: session.token_type,
              user: session.user,
            }));
          }
        }
      } catch (error) {
        console.error('Failed to sync Supabase session:', error);
      }
    };

    // 초기 세션 동기화
    syncSession();

    // 세션 변경 감지하여 동기화
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const storageKey = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_KEY || 'sb-bsmhubsp-auth-token';

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session) {
          localStorage.setItem(storageKey, JSON.stringify({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            expires_at: session.expires_at,
            expires_in: session.expires_in,
            token_type: session.token_type,
            user: session.user,
          }));
        }
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem(storageKey);
      }
    });

    // 클린업: 리스너 제거
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return null;
}
