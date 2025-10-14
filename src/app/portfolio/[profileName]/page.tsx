import Portfolio from '../Portfolio';
import { getPortfolioParams } from './getPortfolioParams';

export async function generateStaticParams() {
  return getPortfolioParams();
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
