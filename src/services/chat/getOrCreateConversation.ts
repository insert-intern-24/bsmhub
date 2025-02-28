'use server';
import { createClient } from '@/utils/supabase/server';
import type { Database } from '@/utils/supabase/database.types';

/**
 * 두 프로필 간 대화(Conversation)가 존재하면 반환하고, 없으면 새로 생성합니다.
 * (스키마를 'public'으로 사용합니다.)
 */
export async function getOrCreateConversation(
  senderProfileId: string,
  receiverProfileId: string,
): Promise<Database['chat']['Tables']['conversations']['Row']> {
  const supabase = await createClient();

  const { data: existing, error } = await supabase
    .schema('public')
    .from('conversations')
    .select('*')
    .contains('participant_ids', [senderProfileId, receiverProfileId]);

  if (error) throw new Error(error.message);
  if (existing && existing.length > 0) return existing[0];

  const { data: newConversation, error: insertError } = await supabase
    .schema('public')
    .from('conversations')
    .insert([{ participant_ids: [senderProfileId, receiverProfileId] }])
    .select();

  if (insertError) throw new Error(insertError.message);
  return newConversation[0];
}

export default getOrCreateConversation;
