'use server';
import { createClient } from '@/utils/supabase/server';
import { projectType } from '@/app/models/project';

const getCategories = async (projects: projectType[]) => {
  const category_ids = projects.map(project => project.category_id)

  const supabase = await createClient();
  const {data, error} = await supabase
    .schema('project')
    .from('projects')
    .select(`project_category(*)`)
    .in('category_id', category_ids);

  if (error) {
    console.error('프로필 조회 중 오류');
    return [];
  }
  
  return data || [];
}

export default getCategories