'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Body } from '@/app/components/system/text';
import type { ProjectDetailViewModel } from '@/services/project/types';
import { ProjectSummarySection } from '@/app/components/project/sidebar/ProjectSummarySection';
import { ProjectActions } from '@/app/components/project/sidebar/ProjectActions';
import { ProjectLinkSection } from '@/app/components/project/sidebar/ProjectLinkSection';
import { ProjectTechnologiesSection } from '@/app/components/project/sidebar/ProjectTechnologiesSection';
import { ProjectTeamSection } from '@/app/components/project/sidebar/ProjectTeamSection';
import ProfileIcon from '@/app/components/card/portfolio/ProfileIcon';
import { useModal } from '@/app/components/modal';
import ProjectEditModal from './ProjectEditModal';
import { projectConfig } from '@/services/config/projectConfig';

interface ProjectSidebarProps {
  project: ProjectDetailViewModel;
  hasEditPermission?: boolean;
}

const ProjectSidebar = ({
  project,
  hasEditPermission,
}: ProjectSidebarProps) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [shouldFoldSidebar, setShouldFoldSidebar] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { openModal, closeModal } = useModal();

  const handleProjectEdit = useCallback(() => {
    if (!hasEditPermission || !project.id) {
      console.error('User not authorized to edit this project');
      return;
    }

    openModal(
      <ProjectEditModal
        config={projectConfig}
        variables={{ project_id: project.id }}
        mode="update"
        onClose={closeModal}
      />,
    );
  }, [project.id, hasEditPermission, openModal, closeModal]);

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
    <div
      ref={sidebarRef}
      className="flex-shrink-0 w-[21.75rem] min-w-[21.75rem] mobile:w-full mobile:min-w-0 mobile:border-0 mobile:px-0 mobile:pb-8"
    >
      <div className="relative">
        <ProfileIcon image={project.iconImage} />

        <div className="flex-col w-full gap-[1.625rem] pt-[4.5rem]">
          <ProjectSummarySection
            title={project.title}
            description={project.introduction}
          />
        </div>
      </div>

      <aside className="sticky top-24 self-start mobile:static mt-[1.625rem]">
        <div className="flex-col w-full gap-[1.625rem]">
          <ProjectActions
            hasEditPermission={hasEditPermission}
            onEdit={handleProjectEdit}
            links={project.links}
          />

          {/* 링크, 기술스택, 기여자 컨테이너 */}
          <div
            className={`foldable-container relative flex-col w-full gap-[1.625rem] ${
              shouldFoldSidebar && !isSidebarExpanded
                ? 'mobile:max-h-[30vh] mobile:overflow-hidden'
                : ''
            }`}
          >
            <ProjectLinkSection links={project.links} />
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
    </div>
  );
};

export default ProjectSidebar;
