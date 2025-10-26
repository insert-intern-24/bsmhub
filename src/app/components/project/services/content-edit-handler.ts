import { createClient } from '@/utils/supabase/client';

export default async function projectContentEditHandler(
  project_id: number,
  content: string,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('project_html_description')
    .update({ html_content: content } as never)
    .eq('project_id', project_id);
  if (error) {
    return { success: false, error };
  }
  return { success: true };
}
