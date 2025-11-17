'use server';
import { createClient } from '@/services/supabase/server';
import { CardProps } from '@/app/components/card/project/ProjectCard';
import { Tables } from '@/services/supabase/database.types';
import { mapProjectToCardProps, type ProjectBase } from '@/services/project/utils';
import { PROJECT_SELECT_QUERY } from './constants';

type ProjectWithCategory = ProjectBase & {
  project_category: Pick<Tables<'project_category'>, 'category_name'> | null;
};

const QUERY_WITH_CATEGORY = `${PROJECT_SELECT_QUERY},
  project_category!projects_category_id_fkey (category_name)`;

export const getProjects = async (limit?: number): Promise<CardProps[]> => {
  let query = (await createClient()).from('projects').select(QUERY_WITH_CATEGORY);
  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) {
    console.error('프로젝트 조회 중 오류:', error);
    return [];
  }

  return (data as ProjectWithCategory[]).map((p) =>
    mapProjectToCardProps(p, p.project_category?.category_name),
  );
};

export const getProjectsByProfileName = async (
  profileName: string,
  limit?: number,
): Promise<CardProps[]> => {
  const supabase = await createClient();
  const { data: userProfile, error: profileError } = await supabase
    .from('profile')
    .select('profile_id')
    .eq('profile_name', profileName)
    .eq('is_team', false)
    .maybeSingle<{ profile_id: number }>();

  if (profileError || !userProfile) {
    if (profileError) console.error('사용자 프로필 조회 중 오류:', profileError);
    return [];
  }

  const { data: contributions } = await supabase
    .from('project_contributors')
    .select('project_id')
    .eq('profile_id', userProfile.profile_id);

  const projectIds = (contributions as { project_id: number }[] | null)?.map((c) => c.project_id) || [];
  let query = supabase.from('projects').select(QUERY_WITH_CATEGORY);

  if (projectIds.length > 0) {
    query = query.or(`owner.eq.${userProfile.profile_id},project_id.in.(${projectIds.join(',')})`);
  } else {
    query = query.eq('owner', userProfile.profile_id);
  }

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) {
    console.error('프로필별 프로젝트 조회 중 오류:', error);
    return [];
  }

  return (data as ProjectWithCategory[]).map((p) =>
    mapProjectToCardProps(p, p.project_category?.category_name),
  );
};
