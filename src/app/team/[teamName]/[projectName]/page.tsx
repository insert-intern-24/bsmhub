import ProjectDetailPage from '@/app/components/project/page';

interface TeamProjectPageProps {
  params: Promise<{
    teamName: string;
    projectName: string;
  }>;
}

const TeamProjectPage = async ({ params }: TeamProjectPageProps) => {
  return <ProjectDetailPage params={params} />;
};

export default TeamProjectPage;
