'use client';

import { createClient } from '@/utils/supabase/client';
import { CardProps } from '@/app/components/card/project/ProjectCard';
import { Tables } from '@/utils/supabase/database.types';
import { convertFromDatabaseImageURL } from '@/utils/supabase/imageHostConverter';

export type ProjectType = Pick<
  Tables<'projects'>,
  'project_id' | 'project_name' | 'description' | 'project_thumbnail'
>;

export type ProjectWithProfileType = {
  project_id: number;
  project_name: string;
  description: string;
  project_thumbnail: string;
  profile: Pick<Tables<'profile'>, 'profile_name' | 'profile_image' | 'is_team'>;
  project_category: Pick<Tables<'project_category'>, 'category_name'>;
};

export const getProjectsClient = async (): Promise<CardProps[]> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('projects')
    .select(
      `
      project_id,
      project_name,
      description,
      project_thumbnail,
      profile!projects_owner_fkey (
        profile_name,
        profile_image,
        is_team
      ),
      project_category!projects_category_id_fkey (
        category_name
      )
    `,
    )
    .limit(16); // 클라이언트에서 호출 시에도 제한 적용

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
      authors: [
        {
          name: project.profile.profile_name,
          profileImage: convertFromDatabaseImageURL(
            project.profile.profile_image,
          ),
        },
      ],
    }),
  );

  return projects || [];
};
