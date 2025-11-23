import { createClient } from '@/services/supabase/client';

export default async function updateProjectContent(
  project_id: number,
  content: string,
) {
  const supabase = createClient();

  const payload = {
    html_content: content,
    project_id,
  };

  const { error } = await supabase
    .from('project_html_description')
    .upsert(payload as any, {
      onConflict: 'project_id',
    });
  if (error) {
    return { success: false, error };
  }
  return { success: true };
}
