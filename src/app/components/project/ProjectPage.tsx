import { notFound } from 'next/navigation';
import ProjectMainContent from './components/ProjectMainContent';
import ProjectSidebar from './components/ProjectSidebar';
import { getProjectDetailViewModel } from './services/project-service';

export interface ProjectDetailPageProps {
  params: Promise<{
    profileName?: string;
    teamName?: string;
    projectName: string;
  }>;
}

const ProjectDetailPage = async ({ params }: ProjectDetailPageProps) => {
  const { profileName, teamName, projectName } = (await params) ?? notFound();

  const viewModel =
    (await getProjectDetailViewModel(projectName, profileName, teamName)) ??
    notFound();

  return (
    <section className="w-full">
      <div className="flex mobile:flex-col mobile:gap-y-8">
        <ProjectSidebar project={viewModel} />
        <ProjectMainContent project={viewModel} />
      </div>
    </section>
  );
};

export default ProjectDetailPage;
