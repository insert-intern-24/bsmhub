'use server';
import { Database } from '@/utils/supabase/database.types';
import { createClient } from '@/utils/supabase/server';

const createNewProfile = async (
  context: Database['profile']['Tables']['profile']['Insert'],
) => {
  const supabase = await createClient();
  const { data: profile } = await supabase // 프로필 생성
    .schema('profile')
    .from('profile')
    .insert(context)
    .select();
  if (profile) {
    await supabase // 프로필 권한 설정
      .schema('profile')
      .from('profile_permission')
      .insert({ profile_id: profile[0].profile_id });
    console.log('프로필 생성 성공');
    return 0;
  } else {
    throw '프로필 생성 실패. 중복프로필여부 확인요망';
  }
};

export default createNewProfile;
