import { createClient } from '@/utils/supabase/client';
import type { Database } from '@/utils/supabase/database.types';

export function subscribeConversations(
  onUpdate: (
    conversation: Database['public']['Tables']['conversations']['Row'],
  ) => void,
) {
  const supabase = createClient();
  const channel = supabase
    .channel('realtime:conversations')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'conversations',
      },
      (payload: {
        new: Database['public']['Tables']['conversations']['Row'];
      }) => {
        onUpdate(payload.new);
      },
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'conversations',
      },
      (payload: {
        new: Database['public']['Tables']['conversations']['Row'];
      }) => {
        onUpdate(payload.new);
      },
    )
    .subscribe();
  return channel;
}
