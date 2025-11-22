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
      ),
      projects!projects_owner_fkey (
        project_id,
        project_name,
        project_thumbnail,
        description
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

  // 먼저 profileName으로 사용자의 프로필 ID와 owner(student_id)를 찾습니다
  const { data: userProfile, error: profileError } = await supabase
    .from('profile')
    .select('profile_id, owner')
    .eq('profile_name', profileName)
    .eq('is_team', false)
    .maybeSingle<{ profile_id: string; owner: string | null }>();

  if (profileError) {
    console.error('사용자 프로필 조회 중 오류:', profileError);
    return null;
  }

  if (!userProfile) {
    console.log('사용자 프로필이 존재하지 않습니다.');
    return [];
  }

  const teamIds: string[] = [];

  // 1. owner로 등록된 팀들을 조회합니다 (동아리장으로 있는 팀)
  if (userProfile.owner) {
    const { data: ownedTeams, error: ownerError } = await supabase
      .from('profile')
      .select('profile_id')
      .eq('owner', userProfile.owner)
      .eq('is_team', true);

    if (ownerError) {
      console.error('owner 팀 조회 중 오류:', ownerError);
      return null;
    }

    if (ownedTeams && ownedTeams.length > 0) {
      teamIds.push(
        ...(ownedTeams as { profile_id: string }[]).map((t) => t.profile_id),
      );
    }
  }

  // 2. 사용자가 팀원으로 속한 팀들을 조회합니다
  const { data: teamMemberships, error: memberError } = await supabase
    .from('team_member')
    .select('profile_id')
    .eq('participant_id', userProfile.profile_id);

  if (memberError) {
    console.error('팀 멤버십 조회 중 오류:', memberError);
    return null;
  }

  if (teamMemberships && teamMemberships.length > 0) {
    teamIds.push(
      ...(teamMemberships as { profile_id: string }[]).map(
        (tm) => tm.profile_id,
      ),
    );
  }

  // 팀이 하나도 없으면 빈 배열 반환
  if (teamIds.length === 0) {
    return [];
  }

  // 중복 제거
  const uniqueTeamIds = Array.from(new Set(teamIds));

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
      ),
      projects!projects_owner_fkey (
        project_id,
        project_name,
        project_thumbnail,
        description
      )
    `,
    )
    .eq('is_team', true)
    .in('profile_id', uniqueTeamIds);

  if (error) {
    console.error('프로필별 팀 데이터 조회 중 오류:', error);
    return null;
  }

  return data || null;
};
