'use server';
import { CardProps } from "@/app/components/card/project/ProjectCard";
import { createClient } from "@/utils/supabase/server";

interface PersonalProject {
  project_id: number;
  project_name: string;
  description: string;
}

export const getPersonalProjects = async (profile_id: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .rpc('get_personal_projects', { // supabase-js에는 group by가 없기 때문에 rpc query로 구현
      profile_id: profile_id
    })

  if (error) {
    console.error('개인 프로젝트 조회 중 오류')
    return [];
  }

  const projects: CardProps[] = (data as PersonalProject[]).map((project) => ({
    id: project.project_id,
    title: project.description,
    projectImage: '/shared/project.png', // supabase에 사진 저장 기능이 구현되어 있지 않기 때문에 mock 데이터로 대체
    authors: [
      { profileImage: '/shared/profile.png' } // supabase에 사진 저장 기능이 구현되어 있지 않기 때문에 mock 데이터로 대체
    ],
  }));

  return projects || [];
}