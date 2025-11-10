import { createClient } from '@/utils/supabase/server';
import type { ProjectDetailRow } from '../../components/types';

export const fetchFromSupabase = async (
  projectName: string,
  ownerName?: string,
) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projects')
    .select(
      `
        *,
        project_html_description(*),
        project_link(*),
        project_contributors(
          *,
          profile(*)
        ),
        profile!projects_owner_fkey(profile_name)
      `,
    )
    .eq('project_name', projectName)
    .maybeSingle<ProjectDetailRow>();

  if (error) {
    console.error('프로젝트 조회 중 오류');
    return null;
  }

  // 해당 project가 owner의 소유인지 확인 (owner는 profile 또는 team)
  if (ownerName && data) {
    if (!data.profile || data.profile.profile_name !== ownerName) {
      return null;
    }
  }

  return data;
};
