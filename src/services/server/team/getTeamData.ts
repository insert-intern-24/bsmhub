'use server';
import { TeamData } from "@/app/team/types";
import { createClient } from "@/utils/supabase/server";

export const getTeamDetail = async (teamName: string): Promise<TeamData | null> => {
  const supabase = await createClient();

  const { data, error} = await supabase
    .from('profile')
    .select(`
      profile_id,
      profile_name,
      profile_image,
      description,
      created_at,
      profile_link (
        link,
        alt
      ),
      team_member!team_member_team_id_fkey (
        profile!team_member_profile_id_fkey (
          profile_id,
          profile_image
        )
      )
    `)
    .eq('profile_name', teamName)
    .eq('is_team', true)
    .maybeSingle();

  if (error) {
    console.error('팀 데이터 조회 중 오류');
  }

  return data || null;
}