'use server';
import { createClient } from '@/utils/supabase/server';

const getProfileById = async (profile_id: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .schema('profile')
    .from('profile')
    .select('*')
    .eq('profile_id', profile_id);
  if (error) {
    console.error('프로필 조회 중 오류');
    return;
  }
  return data?.[0];
};

export default getProfileById;
