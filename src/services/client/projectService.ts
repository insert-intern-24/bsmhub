'use client';

import { createClient } from '@/utils/supabase/client';
import { CardProps } from '@/app/components/card/project/ProjectCard';
import { convertFromDatabaseImageURL } from '@/utils/supabase/imageHostConverter';

export type ProjectWithProfileType = {
  project_id: number;
  project_name: string;
  description: string;
  project_thumbnail: string;
  profile: {
    profile_name: string;
    profile_image: string;
    is_team: boolean;
  };
  project_category: {
    category_name: string;
  };
};

export const getProjectsClient = async (): Promise<CardProps[]> => {
  const supabase = createClient();

  // 메인 페이지에서 최대 16개의 프로젝트만 조회
  const { data, error } = await supabase
    .from('projects')
    .select(`
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
    `)
    .limit(16);

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
