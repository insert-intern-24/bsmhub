import React from 'react';
import Image from 'next/image';
import { Project } from '../types';

interface ProjectImagesProps {
  projects: Project[];
  variant: 'default' | 'long';
}

const ProjectImages = ({ projects, variant }: ProjectImagesProps) => {
  const containerClass = variant === 'default' 
    ? 'h-[5.75rem] flex gap-1'
    : 'h-[5.75rem] flex gap-1';
    
  const imageClass = variant === 'default'
    ? 'relative w-[6.625rem] h-[5.75rem]'
    : 'relative w-[9.375rem] h-[5.75rem]';

  return (
    <div className={containerClass}>
      {projects.slice(0, 3).map((project, index) => (
        <div className={imageClass} key={index}>
          <Image
            src={project.projectImage}
            alt={project.title}
            fill
            className="object-cover rounded"
          />
        </div>
      ))}
    </div>
  );
};

export default ProjectImages;