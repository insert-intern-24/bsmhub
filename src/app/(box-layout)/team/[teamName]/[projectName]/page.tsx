import ProjectDetailPage from '@/app/components/project/ProjectPage';
import { checkProfileisTeam } from '@/services/server/profile/checkProfileisTeam';
import { notFound } from 'next/navigation';

interface TeamProjectPageProps {
  params: Promise<{
    teamName: string;
    projectName: string;
  }>;
}

const TeamProjectPage = async ({ params }: TeamProjectPageProps) => {
  const { teamName } = await params;

  if (await checkProfileisTeam(teamName))
    return <ProjectDetailPage params={params} />;

  notFound();
};

export default TeamProjectPage;
