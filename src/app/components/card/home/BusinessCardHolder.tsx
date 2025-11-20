'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Title } from '../../ui/text/text';
import { getRecentPortfolios } from '@/utils/localStorage/recentPortfolios';
import PortfolioCard from '../portfolio/PortfolioCard';
import { RecentPortfolioItem } from '@/utils/localStorage/recentPortfolios';

const BusinessCardHolder = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [recentPortfolios, setRecentPortfolios] = useState<RecentPortfolioItem[]>([]);

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

  // 명함 홀더가 호버되어 있을 때 메인 스크롤 방지
  useEffect(() => {
    if (!isHovered) return;

    const preventMainScroll = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      const scrollContainer = target.closest('[data-scroll-container]');
      
      // 스크롤 컨테이너 내부가 아닌 경우에만 메인 스크롤 방지
      if (!scrollContainer) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener('wheel', preventMainScroll, { passive: false });

    return () => {
      window.removeEventListener('wheel', preventMainScroll);
    };
  }, [isHovered]);

  return (
    <div
      data-card-holder
      className="fixed left-0 lg:left-2 bottom-2 z-50 flex mobile:hidden items-center flex-col gap-2 transition-transform duration-300 ease-out pointer-events-auto"
      style={{
        transform: isHovered ? 'translateX(0)' : 'translateX(calc(-100% + 20px))',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onWheel={(e) => {
        // 명함 홀더 내부에서 스크롤할 때 메인 스크롤 방지
        e.stopPropagation();
      }}
    >
      <Title className={isHovered ? 'opacity-100' : 'opacity-0 transition-opacity duration-300'}>
        최근 본 포트폴리오 목록
      </Title>
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
        <div
          data-scroll-container
          className="absolute left-1/2 -translate-x-1/2 bottom-[87px] w-[170px] z-[5] overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          style={{
            height: isHovered ? '400px' : '100px',
            transition: 'height 0.3s ease-out',
          }}
          onWheel={(e) => {
            e.stopPropagation();
            const target = e.currentTarget;
            const { scrollTop, scrollHeight, clientHeight } = target;
            const deltaY = e.deltaY;
            
            // 스크롤 가능 여부 확인
            const isAtTop = scrollTop <= 0;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
            
            // 스크롤이 끝에 도달했을 때만 메인 스크롤 방지
            // 내부 스크롤이 가능한 경우에는 브라우저가 자동으로 처리하도록 함
            if ((deltaY > 0 && isAtBottom) || (deltaY < 0 && isAtTop)) {
              e.preventDefault();
            }
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div
            className="relative w-full"
            style={{
              height: isHovered && recentPortfolios.length > 0
                ? `${Math.abs((recentPortfolios.length - 1) * -180 - 50) + 250}px`
                : '100px',
            }}
          >
            {recentPortfolios.length > 0 ? (
              recentPortfolios.map((portfolio, index) => {
                const zIndex = recentPortfolios.length - index;
                const translateY = isHovered ? index * -180 - 50 : index * -50 + 280;
                const scale = 1 - index * 0.05;
                
                return (
                  <div
                    key={`${portfolio.profile.name}-${index}`}
                    className="absolute left-0 w-full transition-transform duration-300 ease-out overflow-hidden"
                    style={{
                      zIndex,
                      transform: `translateY(${translateY}px)`,
                      transformOrigin: 'bottom center',
                      maxWidth: '170px',
                      bottom: 0,
                    }}
                  >
                    <div className="overflow-hidden rounded w-full" style={{ maxHeight: '200px' }}>
                      <PortfolioCard
                        profile={portfolio.profile}
                        projects={portfolio.projects}
                        src={`/portfolio/${encodeURIComponent(portfolio.profile.name)}`}
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
