'use server';
import { createClient } from "@/utils/supabase/server";
import type { TeamProjectType } from "@/app/team/types";

export const getTeamProjects = async (teamName: string): Promise<TeamProjectType[]> => {
  const supabase = await createClient();

  const { data, error} = await supabase
    .from('projects')
    .select(`
      project_id,
      project_name,
      project_thumbnail,
      description,
      profile!projects_owner_fkey!inner (
        profile_name
      )
    `)
    .eq('profile.profile_name', teamName)

  if (error) {
    console.error('팀 프로젝트 조회 중 오류', error)
  }

  console.log(data)

  return data || [];
}