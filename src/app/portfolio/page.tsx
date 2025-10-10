import SearchTab from './SearchTab';
import { getPortfolioData } from './service/getPortfolioData';

export default async function Portfolio() {
  const portfolioData = await getPortfolioData();
  return (
    <div className="bg-white">
      <SearchTab portfolioData={portfolioData} />
    </div>
  );
}
