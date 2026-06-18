import SearchTab from '@/app/components/portfolio/SearchTab';
import { getPersonalPortfolioData } from '@/services/portfolio/getPersonalPortfolioData.server';
import getJobs from '@/services/portfolio/getJobs.server';

export default async function Portfolio() {
  const portfolioData = await getPersonalPortfolioData();
  const jobs = await getJobs();
  return (
    <div className="bg-white">
      <SearchTab portfolioData={portfolioData} jobs={jobs} />
    </div>
  );
}
