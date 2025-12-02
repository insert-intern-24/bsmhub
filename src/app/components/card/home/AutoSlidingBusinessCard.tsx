import { getPaginatedPortfolioData } from '@/services/portfolio/getPaginatedPortfolioData.server';
import AutoSlidingBusinessCardClient from './AutoSlidingBusinessCardClient';

const AutoSlidingBusinessCard = async () => {
  // 서버에서 초기 포트폴리오 데이터 페칭 (SSR, 1시간 단위로 셔플됨)
  const initialPortfolioData = await getPaginatedPortfolioData(1, 5);

  return <AutoSlidingBusinessCardClient initialData={initialPortfolioData.data} />;
};

export default AutoSlidingBusinessCard;
