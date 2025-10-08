import Portfolio from '../Portfolio';
import { PortfolioProps } from '@/types/portfolio';

const PortfolioPage = async ({ params, searchParams }: PortfolioProps) => {
  const paramsData = await params;
  const searchParamsData = await searchParams;

  return <Portfolio params={paramsData} searchParams={searchParamsData} />;
};

export default PortfolioPage;
