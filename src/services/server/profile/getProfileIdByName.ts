'use server';
import { createClient } from "@/utils/supabase/server";

type ProfileIdType = {
  profile_id: string
}
export const getProfileIdByName = async (profile_name: string): Promise<string | null> => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profile')
    .select('profile_id')
    .eq('profile_name', profile_name)
    .maybeSingle<ProfileIdType>()

  if (error) {
    console.error('프로필 ID 조회 중 오류')
  }

  return data?.profile_id || null;
}