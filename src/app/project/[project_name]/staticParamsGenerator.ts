import { createClient } from '@/utils/supabase/server';

export default async function staticParamsGenerator(): Promise<string[]> {
  const supabase = await createClient(true);
  const { data, error } = await supabase
    .from('projects')
    .select('project_name')
    .returns<{ project_name: string }[]>();
  if (error) {
    console.error('Error fetching project names:', error);
    return [];
  }
  return data?.map((project) => project.project_name) || [];
}
