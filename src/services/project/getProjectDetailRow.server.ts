import { createClient } from '@/services/supabase/server';
import type { ProjectDetailRow } from '@/services/project/types';

export const getProjectDetailRow = async (
  projectName: string,
  ownerName: string,
) => {
  const supabase = await createClient();

  // profile_name으로 profile_id를 조회
  const { data: profileData, error: profileError } = await supabase
    .from('profile')
    .select('profile_id')
    .eq('profile_name', ownerName)
    .maybeSingle<{ profile_id: string }>();

  if (profileError) {
    console.error('프로필 조회 중 오류:', profileError);
    return null;
  }
  if (!profileData) {
    return null;
  }

  // owner와 project_name으로 프로젝트 조회
  const { data, error } = await supabase
    .from('projects')
    .select(
      `
        *,
        project_html_description(*),
        project_link(*),
        project_skills(
          skill_id,
          skills(skill_id, skill_name)
        ),
        project_contributors(
          *,
          profile(*)
        ),
        profile!projects_owner_fkey(profile_name)
      `,
    )
    .eq('project_name', projectName)
    .eq('owner', profileData.profile_id)
    .maybeSingle<ProjectDetailRow>();

  if (error) {
    console.error('프로젝트 조회 중 오류:', error);
    return null;
  }

  return data;
};

