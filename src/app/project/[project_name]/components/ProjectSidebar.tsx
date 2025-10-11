'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Body } from '@/app/components/system/text';
import { convertFromDatabaseImageURL } from '@/utils/supabase/imageHostConverter';
import type { ProjectDetailViewModel } from './types';
import {
  ProjectLinkSection,
  ProjectSummarySection,
  ProjectTechnologiesSection,
} from './project-sidebar/ProjectSummarySection';
import { ProjectTeamSection } from './project-sidebar/ProjectTeamSection';
import { FALLBACK_ICON } from './project-sidebar/styles';

interface ProjectSidebarProps {
  project: ProjectDetailViewModel;
}

const ProjectSidebar = ({ project }: ProjectSidebarProps) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [shouldFoldSidebar, setShouldFoldSidebar] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const checkSidebarHeight = () => {
      if (sidebarRef.current && window.innerWidth <= 900) { // mobile breakpoint
        const sidebarHeight = sidebarRef.current.scrollHeight;
        const viewportHeight = window.innerHeight;
        // Fold if sidebar height exceeds 70% of viewport height
        setShouldFoldSidebar(sidebarHeight > viewportHeight * 0.7);
      } else {
        setShouldFoldSidebar(false);
      }
    };

    checkSidebarHeight();
    window.addEventListener('resize', checkSidebarHeight);
    return () => window.removeEventListener('resize', checkSidebarHeight);
  }, [project]); // Re-check when project data changes

  return (
    <aside 
      ref={sidebarRef}
      className={`relative flex-shrink-0 w-[21.75rem] min-w-[21.75rem] border-r border-gray-200 px-[2.625rem] mobile:w-full mobile:min-w-0 mobile:border-0 mobile:px-0 mobile:pb-8 ${
        shouldFoldSidebar && !isSidebarExpanded ? 'mobile:max-h-[70vh] mobile:overflow-hidden' : ''
      }`}
    >
      <ProjectIcon
        image={project.iconImage ?? FALLBACK_ICON}
        title={project.title}
      />
      <div className="flex-col w-full gap-[1.625rem]">
        <ProjectSummarySection
          title={project.title}
          description={project.introduction}
        />
        <ProjectLinkSection url={project.githubUrl} />
        <ProjectTechnologiesSection technologies={project.technologies} />
        <ProjectTeamSection 
          members={project.team}
        />
        {shouldFoldSidebar && !isSidebarExpanded && (
          <button
            type="button"
            className="mt-4 w-full py-2 text-center"
            onClick={() => setIsSidebarExpanded(true)}
          >
            <Body className="text-gray-base">더보기</Body>
          </button>
        )}
      </div>
    </aside>
  );
};

interface ProjectIconProps {
  image: string;
  title: string;
}

const ProjectIcon = ({ image, title }: ProjectIconProps) => {
  const imageUrl = image.includes('{{supabaseHost}}') ? convertFromDatabaseImageURL(image) : image;
  
  return (
    <div className="absolute top-[-8rem] h-[7.5rem] w-[7.5rem]">
      <Image src={imageUrl} alt={title} fill className="object-cover" />
    </div>
  );
};

export default ProjectSidebar;
