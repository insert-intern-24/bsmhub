'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { useInfinitePortfolio } from '@/utils/hook/useInfinitePortfolio';
import { PortfolioData } from '@/app/components/portfolio/types';
import BusinessCard, { BusinessCardData } from './BusinessCard';
import { convertFromDatabaseImageURL } from '@/services/supabase/imageHostConverter';

const SLIDE_INTERVAL = 1500;
const DEFAULT_AVATAR = '/default-avatar.svg';

const convertPortfolioToBusinessCard = (
  portfolio: PortfolioData,
): BusinessCardData => ({
  id: portfolio.profile.name,
  name: portfolio.profile.name,
  department:
    portfolio.student?.department?.department_name || '학과 정보 없음',
  profileImage: convertFromDatabaseImageURL(portfolio.profile.profile_image),
  profileName: portfolio.profile.name,
  studentName: portfolio.student?.name,
  projects: portfolio.projects.slice(0, 3).map((project, i) => ({
    id: `${portfolio.profile.name}-${i}`,
    title: project.title,
    image: convertFromDatabaseImageURL(project.projectImage) || DEFAULT_AVATAR,
  })),
});

interface AutoSlidingBusinessCardClientProps {
  initialData: PortfolioData[];
}

const AutoSlidingBusinessCardClient = ({ initialData }: AutoSlidingBusinessCardClientProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { data, isLoading, error, loadMore } = useInfinitePortfolio(initialData);

  const displayCards = useMemo(
    () =>
      data.length > 0
        ? data
            .filter((portfolio) => portfolio.projects.length > 0)
            .map(convertPortfolioToBusinessCard)
        : [],
    [data],
  );

  useEffect(() => {
    if (displayCards.length === 0) return;

    const interval = setInterval(() => {
      if (!isHovered) {
        // 호버 중이 아닐 때만 슬라이딩
        setCurrentIndex((prev) => {
          const nextIndex = (prev + 1) % displayCards.length;
          if (nextIndex === 0 && !isLoading) loadMore();
          return nextIndex;
        });
      }
    }, SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, [displayCards.length, isLoading, loadMore, isHovered]);

  // 데이터가 없고 로딩 중일 때만 로딩 표시
  if (isLoading && data.length === 0) {
    return (
      <article className="relative flex items-center justify-center h-full w-[26rem] mobile:w-full mobile:h-[15rem] bg-[#D7EFFF] rounded-[0.25rem] overflow-hidden">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </article>
    );
  }

  if (error || displayCards.length === 0) {
    return (
      <article className="relative flex items-center justify-center h-full w-[26rem] mobile:w-full mobile:h-[15rem] bg-[#D7EFFF] rounded-[0.25rem] overflow-hidden">
        <div className="text-gray-600">포트폴리오 데이터를 불러올 수 없습니다</div>
      </article>
    );
  }

  return (
    <article
      className="relative flex items-center justify-center h-full w-[26rem] mobile:w-full mobile:h-[15rem] bg-[#D7EFFF] rounded-[0.25rem] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        src="/card/AutoSlidingBusinessCard/bottom.svg"
        alt="bottom"
        width={139}
        height={200}
        className="absolute left-[calc(7.5/17*100%)] top-[5px] -translate-x-1/2 z-0"
        priority
      />
      <Image
        src="/card/AutoSlidingBusinessCard/top.svg"
        alt="top"
        width={193}
        height={87}
        className="absolute left-1/2 bottom-0 -translate-x-1/2 z-10"
        priority
      />

      <div className="relative w-full h-full overflow-hidden">
        <div
          className="flex transition-transform ease-in-out h-full"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transitionDuration: '1000ms',
          }}
        >
          {displayCards.map((card) => (
            <div
              key={card.id}
              className="min-w-full flex-shrink-0 flex items-center justify-center px-4 py-2"
            >
              <BusinessCard card={card} />
            </div>
          ))}
        </div>
      </div>
    </article>
  );
};

export default AutoSlidingBusinessCardClient;
