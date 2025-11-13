'use server';
import { TeamData } from '@/app/(box-layout)/team/types';
import { createClient } from '@/services/supabase/server';

export const getAllTeams = async (): Promise<TeamData[] | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profile')
    .select(
      `
      profile_id,
      profile_name,
      profile_image,
      description,
      created_at,
      profile_link (
        link,
        alt
      ),
      team_member!team_member_profile_id_fkey (
        profile!team_member_participant_id_fkey (
          profile_id,
          profile_image
        )
      )
    `,
    )
    .eq('is_team', true);

  if (error) {
    console.error('팀 데이터 조회 중 오류:', error);
    return null;
  }

  return data || null;
};
