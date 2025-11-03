import React from 'react';
import Image from 'next/image';
import { Project } from '../types';

interface ProjectImagesProps {
  projects: Project[];
  variant: 'default' | 'long';
}

const ProjectImages = ({ projects, variant }: ProjectImagesProps) => {
  const containerClass =
    variant === 'default'
      ? 'h-[5.75rem] flex gap-1 w-full'
      : 'h-[5.75rem] flex gap-1 overflow-x-auto';

  const imageClass = [
    'relative h-[5.75rem] overflow-hidden rounded',
    variant === 'default'
      ? 'min-w-[6.625rem] w-full flex-shrink-0'
      : 'w-[9.375rem] flex-shrink-0',
  ]
    .filter(Boolean)
    .join(' ');

  const imageSizes = variant === 'default' ? '106px' : '150px';

  return (
    <div className={containerClass}>
      {(variant === 'default' ? projects.slice(0, 3) : projects).map(
        (project, index) => (
          <div className={imageClass} key={index}>
            <Image
              src={project.projectImage}
              alt={project.title}
              fill
              sizes={imageSizes}
              className="object-cover"
            />
          </div>
        ),
      )}
    </div>
  );
};

export default ProjectImages;
