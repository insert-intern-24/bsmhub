import Image from 'next/image';
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

const ProjectSidebar = ({ project }: ProjectSidebarProps) => (
  <aside className="relative flex-shrink-0 w-[21.75rem] min-w-[21.75rem] border-r border-gray-200 px-[2.625rem] mobile:w-full mobile:min-w-0 mobile:border-0 mobile:px-0 mobile:pb-8">
    <ProjectIcon
      image={project.iconImage ?? FALLBACK_ICON}
      title={project.title}
    />
    <div className="flex-col w-full gap-[1.625rem]">
      <ProjectSummarySection
        title={project.title}
        description={project.shortDescription}
      />
      <ProjectLinkSection url={project.githubUrl} />
      <ProjectTechnologiesSection technologies={project.technologies} />
      <ProjectTeamSection members={project.team} />
    </div>
  </aside>
);

interface ProjectIconProps {
  image: string;
  title: string;
}

const ProjectIcon = ({ image, title }: ProjectIconProps) => (
  <div className="absolute top-[-8rem] h-[7.5rem] w-[7.5rem]">
    <Image src={image} alt={title} fill className="object-cover" />
  </div>
);

export default ProjectSidebar;
