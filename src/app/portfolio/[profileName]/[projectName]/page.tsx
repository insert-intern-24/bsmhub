import ProjectDetailPage from '@/app/components/project/page';

interface PortfolioProjectPageProps {
  params: Promise<{
    profileName: string;
    projectName: string;
  }>;
}

const PortfolioProjectPage = async ({ params }: PortfolioProjectPageProps) => {
  return <ProjectDetailPage params={params} />;
};

export default PortfolioProjectPage;
