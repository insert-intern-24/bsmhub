'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useInfinitePortfolio } from '@/utils/hook/useInfinitePortfolio';
import { PortfolioData } from '@/app/components/portfolio/types';
import BusinessCard, { BusinessCardData } from './BusinessCard';
import { convertFromDatabaseImageURL } from '@/services/supabase/imageHostConverter';

const SLIDE_INTERVAL = 1500;
const DEFAULT_AVATAR = '/default-avatar.svg';

const DEFAULT_CARDS: BusinessCardData[] = [
  {
    id: '1',
    name: '홍길동',
    department: '소프트웨어개발과',
    profileImage: DEFAULT_AVATAR,
    profileName: 'hong-gildong',
    projects: [
      { id: '1', title: '산뜻 - SANDDEOT', image: DEFAULT_AVATAR },
      { id: '2', title: 'FindOut', image: DEFAULT_AVATAR },
      { id: '3', title: 'FindOut', image: DEFAULT_AVATAR },
    ],
  },
  {
    id: '2',
    name: '김철수',
    department: '컴퓨터공학과',
    profileImage: DEFAULT_AVATAR,
    profileName: 'kim-cheolsu',
    projects: [
      { id: '1', title: '프로젝트 A', image: DEFAULT_AVATAR },
      { id: '2', title: '프로젝트 B', image: DEFAULT_AVATAR },
    ],
  },
];

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

const AutoSlidingBusinessCard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { data, isLoading, error, loadMore } = useInfinitePortfolio();

  const displayCards =
    data.length > 0 ? data.map(convertPortfolioToBusinessCard) : DEFAULT_CARDS;

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

  if (isLoading && data.length === 0) {
    return (
      <article className="relative flex items-center justify-center h-full w-[26rem] mobile:w-full mobile:h-[15rem] bg-[#D7EFFF] rounded-[0.25rem] overflow-hidden">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </article>
    );
  }

  if (error) {
    return (
      <article className="relative flex items-center justify-center h-full w-[26rem] mobile:w-full mobile:h-[15rem] bg-[#D7EFFF] rounded-[0.25rem] overflow-hidden">
        <div className="text-red-600">데이터 로드 실패</div>
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

export default AutoSlidingBusinessCard;
