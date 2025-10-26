'use client';

import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function AuthCallback() {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('인증 오류:', error);
          router.push('/');
          return;
        }

        if (data.session) {
          // 새 사용자인지 확인
          const { data: profile } = await supabase
            .from('profile')
            .select('profile_id')
            .eq('user_id', data.session.user.id)
            .single();

          if (!profile) {
            // 새 사용자 - 팝업으로 온보딩 모달 열기
            const popup = window.open(
              '/onboarding-popup',
              'onboarding',
              'width=800,height=600,scrollbars=yes,resizable=yes'
            );
            
            if (popup) {
              popup.focus();
            }
          }
        }

        // 메인 페이지로 리다이렉트
        router.push('/');
      } catch (error) {
        console.error('콜백 처리 오류:', error);
        router.push('/');
      }
    };

    handleAuthCallback();
  }, [supabase.auth, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  );
}
