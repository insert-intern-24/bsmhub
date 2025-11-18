'use server';
import { TeamData } from "@/app/(box-layout)/team/types";
import { createClient } from "@/services/supabase/server";

type SupabaseTeamData = {
  profile_id: string;
  profile_name: string;
  profile_image: string | null;
  description: string | null;
  created_at: string;
  owner: string;
  profile_link: Array<{ link: string; alt: string | null }> | null;
  team_member: Array<{
    profile: {
      profile_id: string;
      profile_image: string | null;
    };
  }> | null;
};

export const getTeamData = async (teamName: string): Promise<TeamData | null> => {
  const supabase = await createClient();

  const { data, error} = await supabase
    .from('profile')
    .select(`
      profile_id,
      profile_name,
      profile_image,
      description,
      created_at,
      owner,
      profile_link (
        link,
        alt
      ),
      team_member!team_member_profile_id_fkey (
        profile!team_member_participant_id_fkey (
          profile_id,
          profile_name,
          profile_image
        )
      )
    `)
    .eq('profile_name', teamName)
    .eq('is_team', true)
    .maybeSingle<SupabaseTeamData>();

  if (error) {
    console.error('팀 데이터 조회 중 오류');
  }

  if (!data) {
    return null;
  }

  // alt를 title로 매핑
  return {
    profile_id: data.profile_id,
    profile_name: data.profile_name,
    profile_image: data.profile_image,
    description: data.description,
    created_at: data.created_at,
    owner: data.owner,
    profile_link: (data.profile_link || []).map((link: { link: string; alt: string | null }) => ({
      link: link.link,
      title: link.alt,
    })),
    team_member: data.team_member || [],
  } as TeamData;
}