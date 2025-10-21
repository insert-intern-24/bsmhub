import { createClient } from '@/utils/supabase/server';
import type { ProjectDetailRow } from '../../components/types';

export const fetchFromSupabase = async (projectName: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projects')
    .select(
      `
        *,
        project_markdown(*),
        project_contributors(
          *,
          profile(*)
        )
      `,
    )
    .eq('project_name', projectName)
    .maybeSingle<ProjectDetailRow>();

  if (error) {
    console.error('Failed to load project from Supabase', error);
    return null;
  }

  return data;
};