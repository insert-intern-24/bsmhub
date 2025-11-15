import { createClient } from '@/services/supabase/server';

type ProfileWithOwner = {
  owner: number;
  profile: { owner: string; is_team: boolean } | null;
};

type TeamMemberCheck = {
  participant_id: string;
  profile: { owner: string } | null;
};

/**
 * 프로젝트 수정 권한을 확인하는 함수
 *
 * @param projectId - 확인할 프로젝트의 ID
 * @returns 수정 권한이 있으면 true, 없으면 false
 *
 * 권한 조건:
 * 1. 사용자가 프로젝트의 소유자(owner)인 경우
 * 2. 팀 프로젝트인 경우, 사용자가 팀원(team_member)인 경우
 *
 * 참고: 기여자(contributor)는 프로젝트 자체를 수정할 수 없으며,
 *       project_contributors 테이블에서 본인의 기여 항목만 수정 가능
 */
export default async function checkProjectEditPermission(
  projectId: number,
): Promise<boolean> {
  const supabase = await createClient();

  // 현재 로그인한 사용자 정보 가져오기
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return false;
  }

  // 1. 프로젝트 소유자 확인 (projects 테이블)
  const { data: projectData, error: projectError } = await supabase
    .from('projects')
    .select(
      `
      owner,
      profile:owner (
        owner,
        is_team
      )
    `,
    )
    .eq('project_id', projectId)
    .single<ProfileWithOwner>();

  if (projectError || !projectData || !projectData.profile) {
    return false;
  }

  // 1-1. 프로젝트 소유자가 현재 사용자인 경우
  if (projectData.profile.owner === user.id) {
    return true;
  }

  // 2. 팀 프로젝트인 경우, 팀원 확인 (team_member 테이블)
  if (projectData.profile.is_team) {
    const { data: teamMemberData, error: teamMemberError } = await supabase
      .from('team_member')
      .select(
        `
        participant_id,
        profile:participant_id (
          owner
        )
      `,
      )
      .eq('profile_id', projectData.owner)
      .returns<TeamMemberCheck[]>();

    if (!teamMemberError && teamMemberData) {
      // 현재 사용자가 팀원인지 확인
      const isTeamMember = teamMemberData.some(
        (member) => member.profile && member.profile.owner === user.id,
      );

      if (isTeamMember) {
        return true;
      }
    }
  }

  return false;
}

