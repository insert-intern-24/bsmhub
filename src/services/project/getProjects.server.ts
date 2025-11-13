'use server';

import { createClient } from '@/services/supabase/server';
import { CardProps } from '@/app/components/card/project/ProjectCard';
import { Tables } from '@/services/supabase/database.types';
import { convertFromDatabaseImageURL } from '@/services/supabase/imageHostConverter';
import type { ProjectContributor, ProjectOwnerProfile } from '@/services/project/types';
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
    is_team
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
      projectImage: convertFromDatabaseImageURL(project.project_thumbnail),
      category: project.project_category?.category_name,
      description: project.description,
      isTeam: project.profile.is_team,
      ownerName: project.profile.profile_name,
      authors: createAuthorsFromProject(project),
    }),
  );

  return projects || [];
}

export const getProjects = async (limit?: number): Promise<CardProps[]> => {
  return fetchProjects(limit);
};
