'use server';
import { createClient } from "@/utils/supabase/server";

export const checkProfileTeam = async (profileName: string) => {
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
}