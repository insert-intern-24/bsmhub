import React, { Suspense } from 'react';
import { getAllViewerPortfolioData } from '@/services/portfolio/getAllViewerPortfolioData.server';
import getJobs from '@/services/portfolio/getJobs.server';
import ViewerContent from './ViewerContent';
import ViewerStatic from './ViewerStatic';
import ViewerSkeleton from '@/app/components/viewer/ViewerSkeleton';

// Full Route Cache 설정 (1시간마다 재검증)
// filter 파라미터가 없을 때만 정적 렌더링
export const revalidate = 3600;

interface ViewerPageProps {
  searchParams: Promise<{ filter?: string }>;
}

const ViewerPage = async ({ searchParams }: ViewerPageProps) => {
  const params = await searchParams;
  const showFilter = params.filter === 'true';

  const portfolioData = await getAllViewerPortfolioData();
  const jobs = await getJobs();

  // filter 파라미터가 있으면 동적 렌더링 (클라이언트 컴포넌트), 없으면 정적 렌더링 (서버 컴포넌트)
  if (showFilter) {
    return (
      <Suspense fallback={<ViewerSkeleton />}>
        <ViewerContent portfolioData={portfolioData} jobs={jobs} showFilter={showFilter} />
      </Suspense>
    );
  }

  // 필터가 없을 때는 서버 컴포넌트로 정적 렌더링
  return <ViewerStatic portfolioData={portfolioData} />;
};

export default ViewerPage;

