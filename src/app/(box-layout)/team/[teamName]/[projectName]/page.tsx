import ProjectDetailPage from '@/app/components/project/ProjectPage';
import { checkProfileIsTeam } from '@/services/profile/checkProfileIsTeam.server';
import { notFound } from 'next/navigation';

interface TeamProjectPageProps {
  params: Promise<{
    teamName: string;
    projectName: string;
  }>;
}

const TeamProjectPage = async ({ params }: TeamProjectPageProps) => {
  const { teamName } = await params;

  if (await checkProfileIsTeam(teamName))
    return <ProjectDetailPage params={params} />;

  notFound();
};

export default TeamProjectPage;
