'use client';

import type { ProjectDetailViewModel } from '@/services/project/types';
import ContentEditor from '@/app/components/feature/editor/ContentEditor';

interface ProjectMainContentProps {
  project: ProjectDetailViewModel;
  hasEditPermission?: boolean;
}

const ProjectMainContent = ({ project, hasEditPermission }: ProjectMainContentProps) => {
  return (
    <ContentEditor
      contentType="project"
      id={project.id}
      initialHtmlContent={project.detailDescription}
      hasEditPermission={hasEditPermission}
    />
  );
};

export default ProjectMainContent;
