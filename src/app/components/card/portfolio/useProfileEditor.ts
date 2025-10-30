'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

export function useCurrentUser() {
  const supabase = createClient();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // 현재 로그인된 사용자 확인
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setCurrentUser(session?.user || null);
    });

    // 초기 사용자 상태 설정
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return currentUser;
}
