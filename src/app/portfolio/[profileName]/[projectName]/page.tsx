import ProjectDetailPage from '@/app/components/project/page';

export interface PortfolioProjectPageProps {
  params: Promise<{
    profileName: string;
    projectName: string;
  }>;
}

const PortfolioProjectPage = async ({ params }: PortfolioProjectPageProps) => {
  return <ProjectDetailPage params={params} />;
};

export default PortfolioProjectPage;
