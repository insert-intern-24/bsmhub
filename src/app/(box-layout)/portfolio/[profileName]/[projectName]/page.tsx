import ProjectDetailPage from '@/app/components/feature/project/ProjectPage';
import { checkProfileIsTeam } from '@/services/profile/checkProfileIsTeam.server';
import { notFound } from 'next/navigation';

interface PortfolioProjectPageProps {
  params: Promise<{
    profileName: string;
    projectName: string;
  }>;
}

const PortfolioProjectPage = async ({ params }: PortfolioProjectPageProps) => {
  const { profileName, projectName } = await params;
  const decodedProfileName = decodeURIComponent(profileName);
  const decodedProjectName = decodeURIComponent(projectName);

  if (!(await checkProfileIsTeam(decodedProfileName)))
    return (
      <ProjectDetailPage
        params={Promise.resolve({
          profileName: decodedProfileName,
          projectName: decodedProjectName,
        })}
      />
    );

  notFound();
};

export default PortfolioProjectPage;
