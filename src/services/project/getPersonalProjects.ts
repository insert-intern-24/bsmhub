'use server';
import { CardProps } from "@/app/components/card/project/ProjectCard";
import { createClient } from "@/utils/supabase/server";
import { Database } from "@/utils/supabase/database.types";

export type PersonalProjectType = Pick<
  Database['public']['Tables']['projects']['Row'],
  'project_id' | 'project_name' | 'description' | 'project_thumbnail'
>;

export const getPersonalProjects = async (profile_id: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projects')
    .select(`
      project_id,
      project_name,
      description,
      project_thumbnail
    `)
    .eq('owner', profile_id)
    
  if (error) {
    console.error('개인 프로젝트 조회 중 오류')
  }

  const projects: CardProps[] = (data as PersonalProjectType[]).map((project) => ({
    id: project.project_id,
    title: project.description,
    projectImage: project.project_thumbnail.replace('{{supabaseHost}}', process.env.NEXT_PUBLIC_SUPABASE_URL!),
    authors: [
      { profileImage: '/shared/profile.png' } // profile 페이지에서 따로 조회한 profileImage 사용
    ],
  }));

  return projects || [];
}