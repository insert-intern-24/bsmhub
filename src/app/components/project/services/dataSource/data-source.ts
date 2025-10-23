import { createClient } from '@/utils/supabase/server';
import type { ProjectDetailRow } from '../../components/types';

export const fetchFromSupabase = async (projectName: string, profileName?: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projects')
    .select(
      `
        *,
        project_markdown(*),
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

  // 해당 project가 owner의 소유인지 확인
  if (profileName && data) {
    if (!data.profile || data.profile.profile_name !== profileName) {
      return null;
    }
  }

  return data;
};