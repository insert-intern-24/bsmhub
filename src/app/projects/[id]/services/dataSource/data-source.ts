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
        project_id,
        project_name,
        description,
        status,
        category_id,
        created_at,
        project_markdown:project_markdown(mark_id, mark_desc, project_id),
        project_contributors:project_contributors(
          project_id,
          student_id,
          description,
          student:student(
            student_id,
            name,
            profile,
            department_id,
            join_at,
            birthday,
            graduate_at,
            email,
            gender,
            phone,
            student_number
          )
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
