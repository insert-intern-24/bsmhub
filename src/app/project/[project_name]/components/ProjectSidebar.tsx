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
      if (sidebarRef.current && window.innerWidth <= 900) {
        const foldableContainer = sidebarRef.current.querySelector(
          '.foldable-container',
        ) as HTMLElement;
        if (foldableContainer) {
          const containerHeight = foldableContainer.scrollHeight;
          const viewportHeight = window.innerHeight;
          setShouldFoldSidebar(containerHeight > viewportHeight * 0.4);
        }
      } else {
        setShouldFoldSidebar(false);
      }
    };

    checkSidebarHeight();
    window.addEventListener('resize', checkSidebarHeight);
    return () => window.removeEventListener('resize', checkSidebarHeight);
  }, [project]);

  return (
    <aside
      ref={sidebarRef}
      className="relative flex-shrink-0 w-[21.75rem] min-w-[21.75rem] border-r border-gray-200 px-[2.625rem] mobile:w-full mobile:min-w-0 mobile:border-0 mobile:px-0 mobile:pb-8"
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

        {/* 링크, 기술스택, 기여자 컨테이너 */}
        <div
          className={`foldable-container relative flex-col w-full gap-[1.625rem] ${
            shouldFoldSidebar && !isSidebarExpanded
              ? 'mobile:max-h-[30vh] mobile:overflow-hidden'
              : ''
          }`}
        >
          <ProjectLinkSection url={project.githubUrl} />
          <ProjectTechnologiesSection technologies={project.technologies} />
          <ProjectTeamSection members={project.team} />

          {/* 그라데이션 오버레이와 더보기 버튼 */}
          {shouldFoldSidebar && !isSidebarExpanded && (
            <>
              <div className="pointer-events-none absolute inset-0 z-10 hidden bg-gradient-to-b from-white/70 via-white/85 to-white mobile:block" />
              <div className="absolute inset-x-0 bottom-0 z-20 hidden justify-center mobile:flex">
                <button
                  type="button"
                  className="pointer-events-auto px-4 py-1"
                  onClick={() => setIsSidebarExpanded(true)}
                >
                  <Body className="text-detail">더보기</Body>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
};

interface ProjectIconProps {
  image: string;
  title: string;
}

const ProjectIcon = ({ image, title }: ProjectIconProps) => {
  const imageUrl = image.includes('{{supabaseHost}}')
    ? convertFromDatabaseImageURL(image)
    : image;

  return (
    <div className="absolute top-[-8rem] h-[7.5rem] w-[7.5rem]">
      <Image src={imageUrl} alt={title} fill className="object-cover" />
    </div>
  );
};

export default ProjectSidebar;
