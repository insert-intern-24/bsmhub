'use client';
import { createClient } from '@/utils/supabase/client';
import type { Database } from '@/utils/supabase/database.types';

export type ChatMessage = Database['public']['Tables']['chat_messages']['Row'];

/**
 * 지정된 conversationId에 대해 새 메시지(INSERT)를 실시간 구독합니다.
 * (스키마를 'public'으로 사용)
 */
export function subscribeChatMessages(
  conversationId: string,
  onNewMessage: (msg: ChatMessage) => void,
) {
  const supabase = createClient();
  const channel = supabase
    .channel(`chat_messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload: { new: ChatMessage }) => {
        onNewMessage(payload.new);
      },
    )
    .subscribe();
  return channel;
}

export default subscribeChatMessages;
