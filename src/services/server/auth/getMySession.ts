import { createClient } from '@/utils/supabase/server';

export default async function getMySession() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error('세션 정보를 불러오는 중 오류가 발생했습니다.');
  }

  return data.session;
}
