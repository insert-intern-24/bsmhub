'use server';
import { TeamData } from '@/app/components/team/types';
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
      is_official,
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

export const getTeamsByProfileName = async (
  profileName: string,
): Promise<TeamData[] | null> => {
  const supabase = await createClient();

  // 먼저 profileName으로 사용자의 프로필 ID를 찾습니다
  const { data: userProfile, error: profileError } = await supabase
    .from('profile')
    .select('profile_id')
    .eq('profile_name', profileName)
    .eq('is_team', false)
    .maybeSingle<{ profile_id: number }>();

  if (profileError) {
    console.error('사용자 프로필 조회 중 오류:', profileError);
    return null;
  }

  if (!userProfile) {
    console.log('사용자 프로필이 존재하지 않습니다.');
    return [];
  }

  // 사용자가 속한 팀들을 조회합니다
  const { data: teamMemberships, error: memberError } = await supabase
    .from('team_member')
    .select('profile_id')
    .eq('participant_id', userProfile.profile_id);

  if (memberError) {
    console.error('팀 멤버십 조회 중 오류:', memberError);
    return null;
  }

  if (!teamMemberships || teamMemberships.length === 0) {
    return [];
  }

  const teamIds = (teamMemberships as { profile_id: number }[]).map(
    (tm) => tm.profile_id,
  );

  // 해당 팀들의 정보를 조회합니다
  const { data, error } = await supabase
    .from('profile')
    .select(
      `
      profile_id,
      profile_name,
      profile_image,
      description,
      created_at,
      is_official,
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
    .eq('is_team', true)
    .in('profile_id', teamIds);

  if (error) {
    console.error('프로필별 팀 데이터 조회 중 오류:', error);
    return null;
  }

  return data || null;
};
