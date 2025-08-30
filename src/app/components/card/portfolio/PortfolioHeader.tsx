import React from 'react';
import Image from 'next/image';

interface Project {
  title: string;
  logo: string;
  projectImage: string;
}

interface PortfolioHeaderProps {
  projects: Project[];
}

const PortfolioHeader = ({ projects }: PortfolioHeaderProps) => {
  return (
    <div className="h-[5.75rem] flex gap-1">
      {projects.slice(0, 3).map((project, index) => (
        <div className="relative w-[6.625rem] h-[5.75rem]" key={index}>
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

export default PortfolioHeader;
