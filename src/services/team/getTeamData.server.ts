'use server';
import { TeamData } from '@/app/(box-layout)/team/types';
import { createClient } from '@/services/supabase/server';

type SupabaseTeamData = {
  profile_id: string;
  profile_name: string;
  profile_image: string | null;
  description: string | null;
  created_at: string;
  owner: string;
  is_official?: boolean | null;
  profile_link: Array<{ link: string; alt: string | null }> | null;
  profile_html_description?: {
    html_content: string;
  } | null;
  team_member: Array<{
    profile: {
      profile_id: string;
      profile_image: string | null;
    };
  }> | null;
};

export const getTeamData = async (
  teamName: string,
): Promise<TeamData | null> => {
  const supabase = await createClient();

  const { data: teamProfile, error: teamProfileError } = await supabase
    .from('profile')
    .select(
      `
      profile_id,
      profile_name,
      profile_image,
      description,
      created_at,
      owner,
      is_official,
      profile_html_description (
        html_content
      ),
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
    `,
    )
    .eq('profile_name', teamName)
    .eq('is_team', true)
    .maybeSingle<SupabaseTeamData>();

  if (teamProfileError) {
    console.error('팀 데이터 조회 중 오류');
  }

  if (!teamProfile) {
    return null;
  }

  const { data: ownerProfile, error: ownerProfileError } = await supabase
    .from('profile')
    .select('profile_id, profile_image, profile_name')
    .eq('owner', teamProfile.owner)
    .eq('is_team', false)
    .single();

  if (ownerProfileError) {
    console.error('팀장 프로필 조회 중 오류');
  }


  // alt를 title로 매핑
  return {
    profile_id: teamProfile.profile_id,
    profile_name: teamProfile.profile_name,
    profile_image: teamProfile.profile_image,
    description: teamProfile.description,
    created_at: teamProfile.created_at,
    owner: teamProfile.owner,
    profile_link: (teamProfile.profile_link || []).map(
      (link: { link: string; alt: string | null }) => ({
        link: link.link,
        title: link.alt,
      }),
    ),
    team_member: [
      { profile: ownerProfile },
      ...(teamProfile.team_member || []),
    ],
  } as TeamData;
};
