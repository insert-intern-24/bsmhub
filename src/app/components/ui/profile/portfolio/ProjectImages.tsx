import React from 'react';
import Image from 'next/image';
import { Project } from '@/app/components/card/portfolio/types';
import { convertFromDatabaseImageURL } from '@/services/supabase/imageHostConverter';

interface ProjectImagesProps {
  projects: Project[];
  variant: 'default' | 'long';
}

const ProjectImages = ({ projects, variant }: ProjectImagesProps) => {
  const containerClass =
    variant === 'default'
      ? 'h-[5.75rem] flex gap-1 w-full'
      : 'h-[5.75rem] flex gap-1 overflow-x-scroll';

  const imageClass =
    variant === 'default'
      ? 'relative min-w-[6.625rem] w-full h-[5.75rem]'
      : 'relative w-[9.375rem] h-[5.75rem] flex-shrink-0';

  return (
    <div className={containerClass}>
      {(variant === 'default' ? projects.slice(0, 3) : projects).map(
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
