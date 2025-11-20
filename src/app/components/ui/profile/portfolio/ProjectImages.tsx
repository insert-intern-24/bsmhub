import React from 'react';
import Image from 'next/image';
import { Project } from '@/app/components/card/portfolio/types';
import { convertFromDatabaseImageURL } from '@/services/supabase/imageHostConverter';

interface ProjectImagesProps {
  projects: Project[];
  variant: 'default' | 'long';
  maxProjects?: number;
}

const ProjectImages = ({ projects, variant, maxProjects }: ProjectImagesProps) => {
  const containerClass =
    variant === 'default'
      ? 'h-[5.75rem] flex gap-1 w-full overflow-hidden'
      : 'h-[5.75rem] flex gap-1 overflow-x-scroll';

  const imageClass =
    variant === 'default'
      ? 'relative flex-1 h-[5.75rem]'
      : 'relative w-[9.375rem] h-[5.75rem] flex-shrink-0';

  // maxProjects가 undefined면 무제한, number면 해당 개수만큼 제한
  const displayProjects = maxProjects !== undefined 
    ? projects.slice(0, maxProjects)
    : projects;

  return (
    <div className={containerClass}>
      {displayProjects.map(
        (project, index) => (
          <div className={imageClass} key={index}>
            <Image
              src={convertFromDatabaseImageURL(project.projectImage)}
              alt={project.title}
              fill
              className="object-cover rounded"
            />
          </div>
        ),
      )}
    </div>
  );
};

export default ProjectImages;
