'use server';
import { createClient } from '@/services/supabase/server';
import { CardProps } from '@/app/components/card/project/ProjectCard';
import type { ProjectBase } from '@/services/project/utils';
import { mapProjectToCardProps } from '@/services/project/utils';
import { PROJECT_SELECT_QUERY } from './constants';

const PROJECT_SELECT_QUERY_WITH_INNER = PROJECT_SELECT_QUERY.replace(
  'profile!projects_owner_fkey (',
  'profile!projects_owner_fkey!inner (',
);

export const getCooperationProjects = async (
  profile_id: string,
): Promise<CardProps[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('project_contributors')
    .select(`projects!inner(${PROJECT_SELECT_QUERY_WITH_INNER})`)
    .eq('profile_id', profile_id)
    .eq('projects.profile.is_team', true);

  if (error) {
    console.error('협업 프로젝트 조회 중 오류', error);
    return [];
  }

  return (
    (data as { projects: ProjectBase }[]).map((item) =>
      mapProjectToCardProps(item.projects),
    ) || []
  );
};
