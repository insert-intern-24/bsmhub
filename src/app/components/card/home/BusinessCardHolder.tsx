'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Title } from '../../ui/text/text';
import { getRecentPortfolios } from '@/utils/localStorage/recentPortfolios';
import PortfolioCard from '../portfolio/PortfolioCard';
import { RecentPortfolioItem } from '@/utils/localStorage/recentPortfolios';

const BusinessCardHolder = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [recentPortfolios, setRecentPortfolios] = useState<
    RecentPortfolioItem[]
  >([]);

  useEffect(() => {
    const loadRecentPortfolios = () => {
      setRecentPortfolios(getRecentPortfolios());
    };

    loadRecentPortfolios();
    window.addEventListener('focus', loadRecentPortfolios);
    window.addEventListener('storage', loadRecentPortfolios);

    return () => {
      window.removeEventListener('focus', loadRecentPortfolios);
      window.removeEventListener('storage', loadRecentPortfolios);
    };
  }, []);

  return (
    <div
      className="fixed left-0 lg:left-2 bottom-2 z-50 flex mobile:hidden items-center flex-col gap-2 transition-transform duration-300 ease-out pointer-events-auto"
      style={{
        transform: isHovered
          ? 'translateX(0)'
          : 'translateX(calc(-100% + 20px))',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-[193px] h-[150px]">
        <Image
          src="/card/BusinessCardHolder/bottom.png"
          alt="bottom"
          width={372}
          height={291}
          className="absolute left-1/2 bottom-0 -translate-x-1/2 z-0"
          priority
        />
        {/* top과 bottom 사이의 카드 영역 */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[87px] w-[170px] h-[100px] z-[5] overflow-visible">
          {recentPortfolios.length > 0 ? (
            recentPortfolios.map((portfolio, index) => {
              const zIndex = recentPortfolios.length - index;
              const translateY = isHovered
                ? index * -180 - 50
                : index * -10 - 50;

              return (
                <div
                  key={`${portfolio.profile.name}-${index}`}
                  className="absolute left-0 w-full transition-transform duration-300 ease-out overflow-hidden"
                  style={{
                    zIndex,
                    transform: `translateY(${translateY}px)`,
                    transformOrigin: 'bottom center',
                    maxWidth: '170px',
                  }}
                >
                  <div className="overflow-hidden rounded h-[280px]">
                    <PortfolioCard
                      profile={portfolio.profile}
                      projects={portfolio.projects}
                      src={`/portfolio/${encodeURIComponent(
                        portfolio.profile.name,
                      )}`}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="absolute left-0 w-full text-xs text-gray-base text-center py-4">
              최근 본 포트폴리오가 없습니다
            </div>
          )}
        </div>
        {/* Title을 top.png 중간에 배치 */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[30px] z-[15] w-full text-center">
          <Title
            className={
              `!text-white ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`
            }
          >
            최근 본 포트폴리오 목록
          </Title>
        </div>
        <Image
          src="/card/BusinessCardHolder/top.png"
          alt="top"
          width={193}
          height={87}
          className="absolute left-1/2 bottom-0 -translate-x-1/2 z-10"
          priority
        />
      </div>
    </div>
  );
};

export default BusinessCardHolder;
