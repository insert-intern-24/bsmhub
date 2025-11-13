import { createClient } from '@/services/supabase/client';

export default async function updateProjectContent(
  project_id: number,
  content: string,
) {
  const supabase = createClient();
  const { error } = await supabase
    .from('project_html_description')
    .update({ html_content: content } as never)
    .eq('project_id', project_id);
  if (error) {
    return { success: false, error };
  }
  return { success: true };
}

