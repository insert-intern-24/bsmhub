import SearchTab from './SearchTab';
import { getPersonalPortfolioData } from '@/services/profile/getPersonalPortfolioData';
import getJobs from '../services/server/getJobs';

export default async function Portfolio() {
  const portfolioData = await getPersonalPortfolioData();
  const jobs = await getJobs();
  return (
    <div className="bg-white">
      <SearchTab portfolioData={portfolioData} jobs={jobs} />
    </div>
  );
}
