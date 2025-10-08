import mockProjects from '../../mock-data.json';
import { createClient } from '@/utils/supabase/server';
import type { ProjectDetailRow } from '../../components/types';

const MOCK_PROJECTS = mockProjects as ProjectDetailRow[];

const fetchFromMock = (projectId: number) =>
  MOCK_PROJECTS.find((project) => project.project_id === projectId) ?? null;

const fetchFromSupabase = async (projectId: number) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projects')
    .select(
      `
        *,
        project_markdown:project_markdown(*),
        project_contributors:project_contributors(
          *,
          student:student(*)
        )
      `,
    )
    .eq('project_id', projectId)
    .maybeSingle<ProjectDetailRow>();

  if (error) {
    console.error('Failed to load project from Supabase', error);
    return null;
  }

  return data;
};

export const fetchProjectRow = async (projectId: number) => {
  if (process.env.NEXT_MOCK_MODE === 'true') {
    return fetchFromMock(projectId);
  }

  return fetchFromSupabase(projectId);
};
