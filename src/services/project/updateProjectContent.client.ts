import { createClient } from '@/services/supabase/client';
import type { Database } from '@/services/supabase/database.types';

export default async function updateProjectContent(
  project_id: number,
  content: string,
) {
  const supabase = createClient();

  type ProjectHtmlDescriptionInsert =
    Database['public']['Tables']['project_html_description']['Insert'];

  const payload: ProjectHtmlDescriptionInsert = {
    html_content: content,
    project_id,
  };

  const { error } = await supabase
    .schema('public')
    .from('project_html_description')
    .upsert(payload, {
      onConflict: 'project_id',
    });
  if (error) {
    return { success: false, error };
  }
  return { success: true };
}
