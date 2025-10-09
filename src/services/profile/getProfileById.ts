'use server';
import { ProfileType } from "@/app/portfolio/types/portfolio";
import { createClient } from "@/utils/supabase/server";

export const getProfileById = async (profile_id: string): Promise<ProfileType | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .eq('profile_id', profile_id)
    .eq('isTeam', false)
    .maybeSingle();

  if (error) {
    console.error('프로필 조회 중 오류')
    return null;
  }

  return data || null;
}