import { notFound } from 'next/navigation';
import ProjectMainContent from '@/app/components/project/components/ProjectMainContent';
import ProjectSidebar from '@/app/components/sidebar/ProjectSidebar';
import { getProjectDetailViewModel } from '@/services/project/getProjectDetail.server';
import checkProjectEditPermission from '@/services/project/checkProjectEditPermission.server';
import SidebarContentLayout from '@/app/components/layout/SidebarContentLayout';
import ProfileIcon from '@/app/components/card/portfolio/ProfileIcon';

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

  const hasPermission = await checkProjectEditPermission(viewModel.id);

  return (
    <section className="w-full">
      <div className="w-full relative min-h-[calc(100vh-10rem)] mobile:min-h-0">
        <ProfileIcon image={viewModel.iconImage} />
        <SidebarContentLayout
          className="mobile:gap-y-8"
          sidebar={<ProjectSidebar project={viewModel} hasEditPermission={hasPermission} />}
        >
          <ProjectMainContent
            project={viewModel}
            hasEditPermission={hasPermission}
          />
        </SidebarContentLayout>
      </div>
    </section>
  );
};

export default ProjectDetailPage;
