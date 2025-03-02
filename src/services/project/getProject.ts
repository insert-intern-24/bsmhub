'use server';
import { createClient } from '@/utils/supabase/server';

const getProject = async (profile_id: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .schema('project')
    .from('project_permissions')
    .select(
      `
      projects(
        *,
        category_id:project_category(*)
      )
    `,
    )
    .eq('profile_id', profile_id);

  if (error) {
    console.error('프로필 조회 중 오류', error);
    return [];
  }

  return data || [];
};

export default getProject;
