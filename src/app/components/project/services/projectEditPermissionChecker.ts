import { createClient } from '@/services/supabase/server';

type ProfileWithOwner = {
  profile: { owner: string } | null;
};

/**
 * 프로젝트 수정 권한을 확인하는 함수
 *
 * @param projectId - 확인할 프로젝트의 ID
 * @returns 수정 권한이 있으면 true, 없으면 false
 *
 * 권한 조건:
 * 1. 사용자가 프로젝트의 기여자(contributor)인 경우
 * 2. 사용자가 프로젝트의 소유자(owner)인 경우
 */
export default async function projectEditPermissionChecker(
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

  // 1. 프로젝트 기여자 확인 (project_contributors 테이블)
  const { data: contributorData, error: contributorError } = await supabase
    .from('project_contributors')
    .select(
      `
      profile_id,
      profile:profile_id (
        owner
      )
    `,
    )
    .eq('project_id', projectId)
    .single<ProfileWithOwner>();

  if (!contributorError && contributorData) {
    const profileData = contributorData;
    if (profileData.profile && profileData.profile.owner === user.id) {
      return true;
    }
  }

  // 2. 프로젝트 소유자 확인 (projects 테이블)
  const { data: projectData, error: projectError } = await supabase
    .from('projects')
    .select(
      `
      owner,
      profile:owner (
        owner
      )
    `,
    )
    .eq('project_id', projectId)
    .single<ProfileWithOwner>();

  if (!projectError && projectData) {
    const profileData = projectData;
    if (profileData.profile && profileData.profile.owner === user.id) {
      return true;
    }
  }

  return false;
}
