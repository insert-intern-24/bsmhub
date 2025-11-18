'use server';

import { createClient } from '@/services/supabase/server';
import { CardProps } from '@/app/components/card/project/ProjectCard';
import { Tables } from '@/services/supabase/database.types';
import type {
  ProjectContributor,
  ProjectOwnerProfile,
} from '@/services/project/types';
import { createAuthorsFromProject } from '@/services/project/utils';

export type ProjectType = Pick<
  Tables<'projects'>,
  'project_id' | 'project_name' | 'description' | 'project_thumbnail'
>;

export type ProjectWithProfileType = {
  project_id: number;
  project_name: string;
  description: string;
  project_thumbnail: string;
  profile: ProjectOwnerProfile;
  project_category: Pick<Tables<'project_category'>, 'category_name'>;
  project_contributors: ProjectContributor[];
};

const PROJECT_SELECT_QUERY = `
  project_id,
  project_name,
  description,
  project_thumbnail,
  profile!projects_owner_fkey (
    profile_id,
    profile_name,
    profile_image,
    is_team,
    is_official
  ),
  project_category!projects_category_id_fkey (
    category_name
  ),
  project_contributors (
    profile (
      profile_id,
      profile_name,
      profile_image
    )
  )
`;

async function fetchProjects(limit?: number): Promise<CardProps[]> {
  const supabase = await createClient();
  let query = supabase.from('projects').select(PROJECT_SELECT_QUERY);

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('프로젝트 조회 중 오류:', error);
    return [];
  }

  const projects: CardProps[] = (data as ProjectWithProfileType[]).map(
    (project) => ({
      id: project.project_id,
      title: project.project_name,
      projectImage: project.project_thumbnail,
      category: project.project_category?.category_name,
      description: project.description,
      isTeam: project.profile.is_team,
      isOfficial: Boolean(project.profile.is_official),
      ownerName: project.profile.profile_name,
      authors: createAuthorsFromProject(project, {
        profile_name: project.profile.profile_name,
        profile_image: project.profile.profile_image,
      }),
    }),
  );

  return projects || [];
}

export const getProjects = async (limit?: number): Promise<CardProps[]> => {
  return fetchProjects(limit);
};

export const getProjectsByProfileName = async (
  profileName: string,
  limit?: number,
): Promise<CardProps[]> => {
  const supabase = await createClient();

  // 먼저 profileName으로 사용자의 프로필 ID를 찾습니다
  const { data: userProfile, error: profileError } = await supabase
    .from('profile')
    .select('profile_id')
    .eq('profile_name', profileName)
    .eq('is_team', false)
    .maybeSingle<{ profile_id: number }>();

  if (profileError) {
    console.error('사용자 프로필 조회 중 오류:', profileError);
    return [];
  }

  if (!userProfile) {
    console.log('사용자 프로필이 존재하지 않습니다.');
    return [];
  }

  // 사용자가 소유하거나 기여한 프로젝트 ID들을 조회합니다
  const { data: contributions, error: contributionError } = await supabase
    .from('project_contributors')
    .select('project_id')
    .eq('profile_id', userProfile.profile_id);

  if (contributionError) {
    console.error('프로젝트 기여자 조회 중 오류:', contributionError);
    return [];
  }

  const contributedProjectIds =
    (contributions as { project_id: number }[] | null)?.map(
      (c) => c.project_id,
    ) || [];

  // 사용자가 소유하거나 기여한 프로젝트들을 조회합니다
  let query = supabase.from('projects').select(PROJECT_SELECT_QUERY);

  if (contributedProjectIds.length > 0) {
    query = query.or(
      `owner.eq.${
        userProfile.profile_id
      },project_id.in.(${contributedProjectIds.join(',')})`,
    );
  } else {
    query = query.eq('owner', userProfile.profile_id);
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('프로필별 프로젝트 조회 중 오류:', error);
    return [];
  }

  const projects: CardProps[] = (data as ProjectWithProfileType[]).map(
    (project) => ({
      id: project.project_id,
      title: project.project_name,
      projectImage: project.project_thumbnail,
      category: project.project_category?.category_name,
      description: project.description,
      isTeam: project.profile.is_team,
      isOfficial: Boolean(project.profile.is_official),
      ownerName: project.profile.profile_name,
      authors: createAuthorsFromProject(project, {
        profile_name: project.profile.profile_name,
        profile_image: project.profile.profile_image,
      }),
    }),
  );

  return projects || [];
};
