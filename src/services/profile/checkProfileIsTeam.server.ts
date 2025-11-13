'use server';
import { createClient } from '@/services/supabase/server';

export const checkProfileIsTeam = async (profileName: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profile')
    .select('is_team')
    .eq('profile_name', profileName)
    .maybeSingle<{ is_team: boolean }>();

  if (error) {
    console.error('프로필 조회 중 오류');
    return null;
  }

  return data?.is_team ?? null;
};
