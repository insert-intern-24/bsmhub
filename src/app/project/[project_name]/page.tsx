import { notFound } from 'next/navigation';
import ProjectMainContent from './components/ProjectMainContent';
import ProjectSidebar from './components/ProjectSidebar';
import { getProjectDetailViewModel } from './services/project-service';

interface ProjectDetailPageProps {
  params: Promise<{ project_name: string }>;
}

const ProjectDetailPage = async ({ params }: ProjectDetailPageProps) => {
  const { project_name } = await params;

  if (!project_name) {
    notFound();
  }

  const viewModel = await getProjectDetailViewModel(project_name);

  if (!viewModel) {
    notFound();
  }

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
