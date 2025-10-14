import Portfolio from '../Portfolio';
import { getPersonalPortfolioData } from '@/services/server/portfolio/getPersonalPortfolioData';

export async function generateStaticParams() {
  const portfolioData = await getPersonalPortfolioData();
  return portfolioData.map((data) => ({
    profileName: encodeURIComponent(data.profile.name),
  }));
}

interface PortfolioProps {
  params: Promise<{ profileName: string }>;
  searchParams: Promise<{
    path: 'home' | 'project';
  }>;
}

const PortfolioPage = async ({ params, searchParams }: PortfolioProps) => {
  const profileName = (await params).profileName;
  const path = (await searchParams).path ?? 'home';

  return <Portfolio profileName={profileName} path={path} />;
};

export default PortfolioPage;
