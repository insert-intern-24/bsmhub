import { createClient } from '@/services/supabase/server';
import type { ProjectSortData } from '@/utils/project/sortProjects';

type ProjectWithProfile = {
  project_id: number;
  created_at: string | null;
  project_html_description: {
    html_content: string;
  }[] | null;
  profile: {
    profile_id: string;
    is_team: boolean;
    student?: { join_at: string } | null;
  } | null;
};

/**
 * 프로젝트 정렬을 위한 추가 데이터 조회
 */
export async function getProjectSortData(
  projectIds: number[],
): Promise<Map<number, ProjectSortData>> {
  const sortDataMap = new Map<number, ProjectSortData>();

  if (projectIds.length === 0) return sortDataMap;

  const supabase = await createClient();

  const { data: projects, error } = await supabase
    .from('projects')
    .select(
      `
      project_id,
      created_at,
      project_html_description (
        html_content
      ),
      profile!projects_owner_fkey (
        profile_id,
        is_team,
        student!profile_owner_fkey1 (
          join_at
        )
      )
    `,
    )
    .in('project_id', projectIds)
    .returns<ProjectWithProfile[]>();

  if (error) {
    console.error('프로젝트 정렬 데이터 조회 중 오류:', error);
    return sortDataMap;
  }

  projects?.forEach((project) => {
    const profile = project.profile;

    if (profile) {
      const htmlDescriptionExists =
        project.project_html_description &&
        project.project_html_description.length > 0 &&
        project.project_html_description[0].html_content.trim() !== '';

      sortDataMap.set(project.project_id, {
        projectId: project.project_id,
        isTeam: profile.is_team,
        joinAt: profile.student?.join_at ?? null,
        createdAt: project.created_at ?? null,
        hasHtmlDescription: !!htmlDescriptionExists,
      });
    }
  });

  return sortDataMap;
}
