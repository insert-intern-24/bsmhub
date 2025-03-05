import React from 'react';
import Image from 'next/image';
import ProjectImage from '@public/images/icon/Project_Image.svg';
import { Projects } from '@/app/models/projectSearch';
import { StatusTag } from '@/app/models/project';

export default function ProjectCard({ projects }: { projects: Projects }) {
  const getStatusText = (status: number) => {
    return StatusTag[status] || '알 수 없음';
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
              <span className="text-descriptionColor text-base font-normal leading-none">
                {project.description}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
