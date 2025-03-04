import { createClient } from '@/utils/supabase/client';
import type { Database } from '@/utils/supabase/database.types';

export async function markConversationAsRead(
  conversationId: string,
  myProfileId: string,
): Promise<Database['public']['Tables']['conversations']['Row'] | null> {
  const supabase = createClient();

  // 1. 현재 unread_user_ids 배열을 조회
  const { data: conversation, error: fetchError } = await supabase
    .from('conversations')
    .select('unread_user_ids')
    .eq('conversation_id', conversationId)
    .single();

  if (fetchError || !conversation) {
    console.error('대화 조회 에러:', fetchError);
    return null;
  }

  // 2. 내 프로필 ID를 제거한 배열 생성
  const newUnreadUserIds = conversation.unread_user_ids.filter(
    (id) => id !== myProfileId,
  );

  // 3. 대화 업데이트: unread_user_ids를 새 배열로 변경
  const { data, error } = await supabase
    .from('conversations')
    .update({ unread_user_ids: newUnreadUserIds })
    .eq('conversation_id', conversationId)
    .single();

  if (error) {
    console.error('대화 업데이트 에러:', error);
    return null;
  }
  return data;
}
