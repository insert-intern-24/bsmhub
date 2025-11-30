import React from 'react';
import Image from 'next/image';
import PortfolioSheet from '@/app/components/viewer/PortfolioSheet';
import { getAllViewerPortfolioData, ViewerPortfolioData } from '@/services/portfolio/getAllViewerPortfolioData.server';

// Full Route Cache 설정 (1시간마다 재검증)
export const revalidate = 3600;

const getBanner = (dept: string | null): string | null => {
  if (!dept) return null;
  if (dept.includes('소프트웨어개발과') || dept.includes('소프트웨어 개발과')) return '/banner/s.png';
  if (dept.includes('임베디드소프트웨어과') || dept.includes('임베디드 소프트웨어과')) return '/banner/es.png';
  return null;
};

const page = async () => {
  const portfolioData = await getAllViewerPortfolioData();

  if (!portfolioData?.length) {
    return (
      <div className="flex-center w-full py-8">
        <p className="text-gray-500">표시할 포트폴리오가 없습니다.</p>
      </div>
    );
  }

  const items: Array<{ type: 'banner'; src: string } | { type: 'portfolio'; data: ViewerPortfolioData }> = [];
  let lastDept: string | null = null;

  portfolioData.forEach((data) => {
    const dept = data.department?.department_name || null;
    if (dept !== lastDept) {
      const banner = getBanner(dept);
      if (banner) items.push({ type: 'banner', src: banner });
      lastDept = dept;
    }
    items.push({ type: 'portfolio', data });
  });

  return (
    <div className="flex-col gap-40 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 w-full">
        {items.map((item, i) =>
          item.type === 'banner' ? (
            <div key={`banner-${i}`} className="col-span-full relative w-full h-auto">
              <Image src={item.src} alt="과 배너" width={1200} height={300} className="w-full h-auto object-contain" priority />
            </div>
          ) : (
            <PortfolioSheet key={item.data.profile.profile_name || i} data={item.data} />
          ),
        )}
      </div>
    </div>
  );
};

export default page;