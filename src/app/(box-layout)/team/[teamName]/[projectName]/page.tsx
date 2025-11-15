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
  const { teamName, projectName } = await params;
  const decodedTeamName = decodeURIComponent(teamName);

  // checkProfileIsTeam은 디코딩된 값을 사용하지만,
  // ProjectDetailPage에는 원본 인코딩된 값을 전달하여 이중 디코딩 방지
  if (await checkProfileIsTeam(decodedTeamName))
    return (
      <ProjectDetailPage
        params={Promise.resolve({
          teamName,
          projectName,
        })}
      />
    );

  notFound();
};

export default TeamProjectPage;
