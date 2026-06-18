import Portfolio from '@/app/components/portfolio/Portfolio';

interface PortfolioProps {
  params: Promise<{ profileName: string }>;
  searchParams: Promise<{
    path: 'home' | 'project';
  }>;
}

const PortfolioPage = async ({ params, searchParams }: PortfolioProps) => {
  const profileName = (await params).profileName;
  const path = (await searchParams).path ?? 'home';

  return (
    <Portfolio profileName={decodeURIComponent(profileName)} path={path} />
  );
};

export default PortfolioPage;
