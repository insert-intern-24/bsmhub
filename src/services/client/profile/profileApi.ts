'use client';

import { createClient } from '@/utils/supabase/client';

// 프로필 존재 여부 확인 함수
export const checkProfileExistence = async (): Promise<boolean> => {
  const supabase = createClient();
  
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return false;
    }

    const { data, error } = await supabase
      .from('profile')
      .select('profile_id')
      .eq('owner', user.id)
      .eq('is_team', false)
      .single();
    if (error) {
      console.error('Profile existence check error:', error);
      return false;
    }

    return !!data;
  } catch {
    return false;
  }
};
