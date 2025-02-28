'use server';
import { createClient } from '@/utils/supabase/server';

/**
 * 지정된 프로필 ID가 포함된 모든 대화(Conversation) 목록을 조회합니다.
 * (스키마를 'public'으로 사용)
 */
export async function getConversationsForProfile(profileId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .schema('public')
    .from('conversations')
    .select('*')
    .contains('participant_ids', [profileId])
    .order('updated_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export default getConversationsForProfile;
