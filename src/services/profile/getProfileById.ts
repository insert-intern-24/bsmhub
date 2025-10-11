'use server';
import { Tables } from "@/utils/supabase/database.types";
import { createClient } from "@/utils/supabase/server";

export const getProfileById = async (profile_id: string): Promise<Tables<'profile'> | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .eq('profile_id', profile_id)
    .eq('is_team', false)
    .maybeSingle();

  if (error) {
    console.error('프로필 조회 중 오류')
    return null;
  }

  return data || null;
}