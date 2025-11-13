import ProjectDetailPage from '@/app/components/project/ProjectPage';
import { checkProfileIsTeam } from '@/services/profile/checkProfileIsTeam.server';
import { notFound } from 'next/navigation';

interface PortfolioProjectPageProps {
  params: Promise<{
    profileName: string;
    projectName: string;
  }>;
}

const PortfolioProjectPage = async ({ params }: PortfolioProjectPageProps) => {
  const { profileName } = await params;

  if (!(await checkProfileIsTeam(profileName)))
    return <ProjectDetailPage params={params} />;

  notFound();
};

export default PortfolioProjectPage;
