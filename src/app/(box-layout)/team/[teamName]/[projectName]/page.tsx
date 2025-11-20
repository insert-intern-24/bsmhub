import ProjectDetailPage from '@/app/components/feature/project/ProjectPage';
import { checkProfileIsTeam } from '@/services/profile/checkProfileIsTeam.server';
import { notFound } from 'next/navigation';

interface TeamProjectPageProps {
  params: Promise<{
    teamName: string;
    projectName: string;
  }>;
}

const TeamProjectPage = async ({ params }: TeamProjectPageProps) => {
  const { teamName, projectName } = await params;
  const decodedTeamName = decodeURIComponent(teamName);
  const decodedProjectName = decodeURIComponent(projectName);

  if (await checkProfileIsTeam(decodedTeamName))
    return (
      <ProjectDetailPage
        params={Promise.resolve({
          teamName: decodedTeamName,
          projectName: decodedProjectName,
        })}
      />
    );

  notFound();
};

export default TeamProjectPage;
