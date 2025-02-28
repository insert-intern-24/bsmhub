import { createClient } from '@/utils/supabase/client';
import type { ChatMessage } from '@/services/chat/sendChatMessage';

export async function getChatMessages(
  conversationId: string,
): Promise<ChatMessage[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching chat messages:', error);
    return [];
  }

  return data || [];
}
