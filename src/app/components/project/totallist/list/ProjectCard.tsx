import React from 'react';
import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import ProjectImage from '@public/images/icon/Project_Image.svg';

export default async function ProjectCard() {
  const supabase = await createClient();

  const { data: projects, error: projectsError } = await supabase
    .schema('project')
    .from('projects')
    .select('*, category_id!inner(*)');

  if (projectsError) {
    console.error(projectsError);
    return <div>not found projects</div>;
  } else {
    console.log(projects);
  }

  const getStatusText = (status: number) => {
    switch (status) {
      case 1:
        return '개발중';
      case 2:
        return '서비스 중';
      case 3:
        return '개발완료';
      case 4:
        return '기획중';
      default:
        return '알 수 없음';
    }
  };

  return (
    <>
      <div className="flex items-start content-start gap-5 self-stretch flex-wrap">
        {projects.map((project) => (
          <div
            key={project.project_id}
            className="flex flex-col items-start gap-2 w-[20.6875rem]"
          >
            <div className="relative">
              <Image
                src={ProjectImage}
                alt="ProjectImage"
                width={331}
                height={222}
              />
              <div className="flex justify-center items-center rounded-full px-4 py-[0.125rem] bg-white absolute left-[0.8125rem] bottom-[0.8125rem]">
                <span className="text-black text-xs font-bold leading-none">
                  {getStatusText(project.status)}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-start self-stretch">
              <span className="text-[#1462FF] self-stretch text-sm font-normal leading-none">
                {project.category_id.category_name}
              </span>
              <span className="text-black self-stretch text-2xl font-bold leading-none">
                {project.project_name}
              </span>
              <span className="text-[#5E5E5E] text-base font-normal leading-none">
                {project.description}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
