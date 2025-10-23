import { notFound } from 'next/navigation';
import ProjectMainContent from './components/ProjectMainContent';
import ProjectSidebar from './components/ProjectSidebar';
import { getProjectDetailViewModel } from './services/project-service';
import type { PortfolioProjectPageProps } from '@/app/portfolio/[profileName]/[projectName]/page';

const ProjectDetailPage = async ({ params }: PortfolioProjectPageProps) => {
  const { projectName, profileName } = (await params) ?? notFound();

  const viewModel =
    (await getProjectDetailViewModel(projectName, profileName)) ?? notFound();

  return (
    <section className="max-w-outer mx-auto py-[4.5rem]">
      <div className="flex mobile:flex-col mobile:gap-y-8">
        <ProjectSidebar project={viewModel} />
        <ProjectMainContent project={viewModel} />
      </div>
    </section>
  );
};

export default ProjectDetailPage;
