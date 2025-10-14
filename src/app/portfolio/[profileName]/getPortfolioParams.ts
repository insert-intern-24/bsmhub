import { getPersonalPortfolioData } from '@/services/server/portfolio/getPersonalPortfolioData';

export async function getPortfolioParams() {
  const portfolioData = await getPersonalPortfolioData();
  return portfolioData.map((data) => ({
    profileName: encodeURIComponent(data.profile.name),
  }));
}