'use server';
import { CardProps } from "@/app/components/card/project/ProjectCard";
import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/utils/supabase/database.types";
import { convertFromDatabaseImageURL } from "@/utils/supabase/imageHostConverter";

export type PersonalProjectType = Pick<
  Tables<'projects'>,
  'project_id' | 'project_name' | 'description' | 'project_thumbnail'
>;

type PersonalProjectTypeWithProfile = PersonalProjectType & {
  profile: Pick<Tables<'profile'>, 'profile_name' | 'is_team'>
}

export const getPersonalProjects = async (profile_id: string): Promise<CardProps[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projects')
    .select(`
      project_id,
      project_name,
      description,
      project_thumbnail,
      profile!projects_owner_fkey (
        profile_name,
        is_team
      )
    `)
    .eq('owner', profile_id)
    
  if (error) {
    console.error('개인 프로젝트 조회 중 오류')
  }

  const projects: CardProps[] = (data as PersonalProjectTypeWithProfile[]).map((project) => ({
    id: project.project_id,
    title: project.project_name,
    description: project.description,
    projectImage: convertFromDatabaseImageURL(project.project_thumbnail),
    ownerName: project.profile.profile_name,
    isTeam: project.profile.is_team,
    authors: [
      { profileImage: '' } // profile 페이지에서 따로 조회한 profileImage 사용
    ],
  }));

  return projects || [];
}