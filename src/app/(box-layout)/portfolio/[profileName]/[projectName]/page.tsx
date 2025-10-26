import ProjectDetailPage from '@/app/components/project/ProjectPage';
import { checkProfileisTeam } from '@/services/server/profile/checkProfileisTeam';
import { notFound } from 'next/navigation';

interface PortfolioProjectPageProps {
  params: Promise<{
    profileName: string;
    projectName: string;
  }>;
}

const PortfolioProjectPage = async ({ params }: PortfolioProjectPageProps) => {
  const { profileName } = await params;

  if (!(await checkProfileisTeam(profileName)))
    return <ProjectDetailPage params={params} />;

  notFound();
};

export default PortfolioProjectPage;
