import Portfolio from '../Portfolio';

interface PortfolioProps {
  params: Promise<{ uuid: string }>;
  searchParams: Promise<{
    path: 'home' | 'project';
  }>;
}

const PortfolioPage = async ({ params, searchParams }: PortfolioProps) => {
  const uuid = (await params).uuid;
  const path = (await searchParams).path ?? 'home';

  if (uuid === 'all') return <div>전체 포트폴리오~~</div>;

  return <Portfolio uuid={uuid} path={path} />;
};

export default PortfolioPage;
