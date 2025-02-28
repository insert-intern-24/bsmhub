import { createClient } from '@/utils/supabase/client';
import type { Database } from '@/utils/supabase/database.types';

export type ChatMessage = Database['public']['Tables']['chat_messages']['Row'];

export async function sendChatMessage(
  conversationId: string,
  senderProfileId: string,
  content: string,
): Promise<ChatMessage | null> {
  const supabase = createClient();

  // 1. 메시지 전송: chat_messages 테이블에 새 메시지 삽입
  const { data: newMessage, error: insertError } = await supabase
    .from('chat_messages')
    .insert({
      conversation_id: conversationId,
      sender_profile_id: senderProfileId,
      content,
    })
    .select()
    .single();

  if (insertError) {
    console.error('메시지 전송 에러:', insertError);
    return null;
  }

  // 2. conversation 테이블 업데이트: 최근 메시지, 읽지 않은 사용자 목록, 보낸 시간 업데이트
  // 먼저 conversation row를 조회해서 participant_ids를 가져옴
  const { data: conversation, error: fetchError } = await supabase
    .from('conversations')
    .select('participant_ids')
    .eq('conversation_id', conversationId)
    .single();

  if (fetchError || !conversation) {
    console.error('대화 조회 에러:', fetchError);
    // 메시지 전송은 성공했으므로 newMessage를 반환합니다.
    return newMessage;
  }

  // 참여자 전체에서 senderProfileId를 제외한 목록을 unread_user_ids로 설정
  const unreadUserIds = conversation.participant_ids.filter(
    (id) => id !== senderProfileId,
  );

  const { error: updateError } = await supabase
    .from('conversations')
    .update({
      last_message: content,
      unread_user_ids: unreadUserIds,
      updated_at: new Date().toISOString(),
    })
    .eq('conversation_id', conversationId)
    .single();

  if (updateError) {
    console.error('대화 업데이트 에러:', updateError);
  }

  return newMessage;
}
