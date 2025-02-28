import { createClient } from '@/utils/supabase/client';
import getProfileById from '@/services/profile/getProfileById';
import getProfileBySession from '@/services/profile/getProfileBySession';

export async function getPartnerProfile(conversationId: string) {
  const supabase = createClient();

  // conversationId에 해당하는 대화 레코드 조회
  const { data: conversation, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('conversation_id', conversationId)
    .single();

  if (error || !conversation) {
    console.error('대화 조회 에러:', error);
    return null;
  }

  // 현재 세션의 내 프로필 조회
  const myProfile = await getProfileBySession();
  if (!myProfile?.profile_id) {
    console.error('내 프로필을 찾을 수 없습니다.');
    return null;
  }

  // participant_ids 배열에서 내 profile id를 제외한 상대방 id 찾기
  const partnerId = conversation.participant_ids.find(
    (id: string) => id !== myProfile.profile_id,
  );
  if (!partnerId) {
    console.error('상대방 프로필을 찾을 수 없습니다.');
    return null;
  }

  // 상대방 프로필 조회
  const partnerProfile = await getProfileById(partnerId);
  return partnerProfile;
}
