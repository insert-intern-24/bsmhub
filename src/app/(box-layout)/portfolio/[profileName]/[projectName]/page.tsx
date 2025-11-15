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
  const { profileName, projectName } = await params;
  const decodedProfileName = decodeURIComponent(profileName);

  // checkProfileIsTeam은 디코딩된 값을 사용하지만,
  // ProjectDetailPage에는 원본 인코딩된 값을 전달하여 이중 디코딩 방지
  if (!(await checkProfileIsTeam(decodedProfileName)))
    return (
      <ProjectDetailPage
        params={Promise.resolve({
          profileName,
          projectName,
        })}
      />
    );

  notFound();
};

export default PortfolioProjectPage;
