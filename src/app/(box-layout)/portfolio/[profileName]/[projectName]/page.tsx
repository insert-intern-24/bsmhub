import ProjectDetailPage from '@/app/components/project/page';
import { checkProfileTeam } from '@/services/server/profile/checkProfileTeam';
import { notFound } from 'next/navigation';

interface PortfolioProjectPageProps {
  params: Promise<{
    profileName: string;
    projectName: string;
  }>;
}

const PortfolioProjectPage = async ({ params }: PortfolioProjectPageProps) => {
  const { profileName } = await params;

  if (!(await checkProfileTeam(profileName)))
    return <ProjectDetailPage params={params} />;

  notFound();
};

export default PortfolioProjectPage;
