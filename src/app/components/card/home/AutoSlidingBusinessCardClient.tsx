'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import { useInfinitePortfolio } from '@/utils/hook/useInfinitePortfolio';
import { PortfolioData } from '@/app/components/portfolio/types';
import BusinessCard, { BusinessCardData } from './BusinessCard';
import { convertFromDatabaseImageURL } from '@/services/supabase/imageHostConverter';
import { shuffleArray } from '@/utils/shuffle';

const SLIDE_INTERVAL = 1500;
const DEFAULT_AVATAR = '/default-avatar.svg';
const CONTAINER_CLASS = 'relative flex items-center justify-center h-full w-[26rem] mobile:w-full mobile:h-[15rem] bg-[#D7EFFF] rounded-[0.25rem] overflow-hidden';

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
  const [shuffledData, setShuffledData] = useState<PortfolioData[]>([]);
  const prevLengthRef = useRef(0);

  useEffect(() => {
    if (!data.length) {
      setShuffledData([]);
      prevLengthRef.current = 0;
      return;
    }

    if (!prevLengthRef.current) {
      setShuffledData(shuffleArray([...data]));
    } else if (data.length > prevLengthRef.current) {
      setShuffledData((prev) => [...prev, ...data.slice(prevLengthRef.current)]);
    }
    prevLengthRef.current = data.length;
  }, [data]);

  const displayCards = useMemo(
    () =>
      shuffledData
        .filter((p) => p.projects.length > 0)
        .map(convertPortfolioToBusinessCard),
    [shuffledData],
  );

  useEffect(() => {
    if (!displayCards.length || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % displayCards.length;
        if (!next && !isLoading) loadMore();
        return next;
      });
    }, SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, [displayCards.length, isLoading, loadMore, isHovered]);

  if ((isLoading && !data.length && !initialData.length) || error || !displayCards.length) {
    return (
      <article className={CONTAINER_CLASS}>
        {isLoading && !data.length && !initialData.length ? (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        ) : (
          <div className="text-gray-600">포트폴리오 데이터를 불러올 수 없습니다</div>
        )}
      </article>
    );
  }

  return (
    <article
      className={CONTAINER_CLASS}
      role="region"
      aria-label="포트폴리오 명함 캐러셀"
      aria-live="polite"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        src="/card/AutoSlidingBusinessCard/bottom.svg"
        alt=""
        width={139}
        height={200}
        className="absolute left-[calc(7.5/17*100%)] top-[5px] -translate-x-1/2 z-0"
        priority
        aria-hidden
      />
      <Image
        src="/card/AutoSlidingBusinessCard/top.svg"
        alt=""
        width={193}
        height={87}
        className="absolute left-1/2 bottom-0 -translate-x-1/2 z-10"
        priority
        aria-hidden
      />
      <div
        className="relative w-full h-full overflow-hidden"
        role="group"
        aria-label={`${displayCards.length}개 중 ${currentIndex + 1}번째 명함`}
      >
        <div
          className="flex transition-transform ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)`, transitionDuration: '1000ms' }}
        >
          {displayCards.map((card) => (
            <div key={card.id} className="min-w-full flex-shrink-0 flex items-center justify-center px-4 py-2">
              <BusinessCard card={card} />
            </div>
          ))}
        </div>
      </div>
    </article>
  );
};

export default AutoSlidingBusinessCardClient;
