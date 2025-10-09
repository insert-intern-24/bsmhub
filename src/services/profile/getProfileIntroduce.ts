'use server';
import { createClient } from "@/utils/supabase/server";

export const getProfileIntroduce = async (profile_id: string): Promise<string> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profile_introduce')
    .select('introduce')
    .eq('profile_id', profile_id)
    .maybeSingle();

  if (error) {
    console.error('프로필 소개 조회 중 오류', error)
    return '';
  }

  return data.introduce || '';
}