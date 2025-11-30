import React from 'react';
import PortfolioSheet from '@/app/components/viewer/PortfolioSheet';
import ViewerPagination from '@/app/components/viewer/ViewerPagination';
import { getAllViewerPortfolioData } from '@/services/portfolio/getAllViewerPortfolioData.server';

interface PageProps {
  searchParams: { page?: string };
}

const page = async ({ searchParams }: PageProps) => {
  const pageNumber = parseInt(searchParams.page || '1', 10);
  const limit = 10;

  const {
    data: portfolioData,
    totalPages,
    currentPage,
  } = await getAllViewerPortfolioData(pageNumber, limit);

  if (!portfolioData || portfolioData.length === 0) {
    return (
      <div className="flex-center w-full py-8">
        <p className="text-gray-500">표시할 포트폴리오가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex-col gap-40 w-full">
      {portfolioData.map((data, index) => (
        <PortfolioSheet key={data.profile.profile_name || index} data={data} />
      ))}
      <ViewerPagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/viewer"
      />
    </div>
  );
};

export default page;