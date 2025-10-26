'use client';

import { createClient } from '@/utils/supabase/client';

export const getIsExistProfileClient = async (): Promise<boolean> => {
  const supabase = createClient();

  try {
    // 현재 로그인된 사용자 정보 가져오기
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('사용자 정보 조회 오류:', userError);
      return false;
    }

    const { data, error } = await supabase
      .from('profile')
      .select('profile_id')
      .eq('owner', user.id)
      .maybeSingle();

    if (error) {
      console.error('프로필 조회 오류:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('프로필 조회 중 예외 발생:', error);
    return false;
  }
};
