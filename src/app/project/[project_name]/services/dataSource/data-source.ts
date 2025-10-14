import mockProjects from '../../mock-data.json';
import { createClient } from '@/utils/supabase/server';
import type { ProjectDetailRow } from '../../components/types';

const MOCK_PROJECTS = mockProjects as ProjectDetailRow[];

const fetchFromMock = (projectName: string) =>
  MOCK_PROJECTS.find((project) => project.project_name === projectName) ?? null;

const fetchFromSupabase = async (projectName: string) => {
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

export const fetchProjectRow = async (projectName: string) => {
  if (process.env.NEXT_MOCK_MODE === 'true') {
    return fetchFromMock(projectName);
  }

  return fetchFromSupabase(projectName);
};
