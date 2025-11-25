import { LinkSection } from '@/app/components/section/common/LinkSection';
import { projectConfig } from '@/services/config/projectConfig';

interface ProjectLinkSectionProps {
  links: Array<{ url: string; title: string | null }>;
}

export const ProjectLinkSection = ({
  links,
}: ProjectLinkSectionProps) => {
  return (
    <LinkSection
      links={links}
      config={projectConfig}
      fieldName="project_link"
      excludeTitle="/play"
    />
  );
};
