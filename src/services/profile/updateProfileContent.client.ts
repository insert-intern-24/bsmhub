// -- Profile HTML Description Update Service
// -- This function will be used to upsert profile HTML descriptions
// -- Similar to the project_html_description implementation

import { createClient } from '@/services/supabase/client';
import type { Database } from '@/services/supabase/database.types';

export default async function updateProfileContent(
  profile_id: string,
  content: string,
) {
  try {
    const supabase = createClient();

    type ProfileHtmlDescriptionInsert =
      Database['public']['Tables']['profile_html_description']['Insert'];

    const payload: ProfileHtmlDescriptionInsert = {
      html_content: content,
      profile_id,
    };

    const { error } = await supabase
      .schema('public')
      .from('profile_html_description')
      .upsert(payload, {
        onConflict: 'profile_id',
      });
    if (error) {
      return { success: false, error };
    }
    return { success: true };
  } catch (error) {
    // 예외 상황(네트워크 오류 등) 처리
    return {
      success: false,
      error: {
        message: '프로필 내용 저장 중 오류가 발생했습니다.',
        detail: error instanceof Error ? error.message : String(error),
      },
    };
  }
}
