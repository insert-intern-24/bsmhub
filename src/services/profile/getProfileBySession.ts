'use server';
import { createClient } from '@/utils/supabase/server';

const getProfileBySession = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) {
    console.error('현재 로그인 상태가 아님.');
    return;
  }
  const { data, error } = await supabase
    .schema('profile')
    .from('profile_permission')
    .select('*, profile_id!inner(*)')
    .eq('student_id', user?.id)
    .eq('profile_id.isTeam', false);
  if (error) {
    console.error('프로필 조회 중 오류');
    return;
  }
  return data?.[0]?.profile_id;
};

export default getProfileBySession;
