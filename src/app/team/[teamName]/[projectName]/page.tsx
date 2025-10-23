import ProjectDetailPage from '@/app/components/project/page';
import { checkProfileTeam } from '@/services/server/profile/checkProfileTeam';
import { notFound } from 'next/navigation';

interface TeamProjectPageProps {
  params: Promise<{
    teamName: string;
    projectName: string;
  }>;
}

const TeamProjectPage = async ({ params }: TeamProjectPageProps) => {
  const { teamName } = await params;

  if (await checkProfileTeam(teamName))
    return <ProjectDetailPage params={params} />;

  notFound();
};

export default TeamProjectPage;
