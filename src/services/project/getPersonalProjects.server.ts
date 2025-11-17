'use server';
import { CardProps } from '@/app/components/card/project/ProjectCard';
import { createClient } from '@/services/supabase/server';
import { mapProjectToCardProps, type ProjectBase } from '@/services/project/utils';
import { PROJECT_SELECT_QUERY } from './constants';

export const getPersonalProjects = async (profile_id: string): Promise<CardProps[]> => {
  const { data, error } = await (await createClient())
    .from('projects')
    .select(PROJECT_SELECT_QUERY)
    .eq('owner', profile_id);

  if (error) {
    console.error('개인 프로젝트 조회 중 오류');
    return [];
  }

  return (data as ProjectBase[]).map((p) => mapProjectToCardProps(p));
};
