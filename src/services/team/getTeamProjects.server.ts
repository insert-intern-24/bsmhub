'use server';
import { createClient } from "@/services/supabase/server";
import type { TeamProjectType } from "@/app/components/team/types";

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
        profile_name,
        is_team
      ),
      project_contributors (
        profile (
          profile_id,
          profile_name,
          profile_image
        )
      )
    `)
    .eq('profile.profile_name', teamName)
    .eq('profile.is_team', true)

  if (error) {
    console.error('팀 프로젝트 조회 중 오류', error)
  }

  return data || [];
}