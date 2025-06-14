'use server';
import { createClient } from '@/utils/supabase/server';

const getProfileMarkdown = async (profile_id: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase

    .from('profile_introduce')
    .select('introduce')
    .eq('profile_id', profile_id);

  if (error) {
    console.error('자기소개 조회 중 오류', error);
    return '';
  }

  return data[0]?.introduce;
};

export default getProfileMarkdown;
