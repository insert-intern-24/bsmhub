'use client';

import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

/**
 * localStorage의 Supabase 세션을 쿠키로 동기화하는 컴포넌트
 * admin-web에서 로그인한 세션을 Next.js 앱에서 사용 가능하도록 함
 */
export default function SupabaseSessionSync() {
  useEffect(() => {
    const syncSession = async () => {
      try {
        const storageKey = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_KEY || 'sb-bsmhubsp-auth-token';
        const storedSession = localStorage.getItem(storageKey);

        if (!storedSession) {
          return;
        }

        // localStorage에 세션이 있으면 Supabase 클라이언트 초기화
        const supabase = createClient();

        // 현재 세션 확인
        const { data: { session } } = await supabase.auth.getSession();

        // 세션이 없거나 만료되었으면 localStorage에서 복원 시도
        if (!session) {
          const sessionData = JSON.parse(storedSession);
          // access_token과 refresh_token이 모두 존재하는지 확인
          if (!sessionData?.access_token || !sessionData?.refresh_token) {
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

    syncSession();
  }, []);

  return null;
}
