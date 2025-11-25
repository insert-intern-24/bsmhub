'use client';

import { useState, useEffect, useCallback } from 'react';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import Image from 'next/image';

type CarouselSlide = string | {
  src: string;
  href?: string;
};

interface AutoCarouselProps {
  interval?: number;
  images: CarouselSlide[];
}

// 간단한 자동 슬라이드 캐러셀
// - public/card/Carousel 내의 이미지를 서버 API로 가져와 표시
// - 마우스 호버 시 일시정지, 좌우 버튼, 인디케이터 제공
export default function AutoCarousel({ interval = 5000, images }: AutoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // 길이 의존 계산을 단일 값으로 저장해 의존성 간결화
  const len = images.length;
  // 다음 슬라이드로 이동
  const goToNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % len);
  }, [len]);

  // 이전 슬라이드로 이동
  const goToPrevious = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + len) % len);
  }, [len]);

  // 자동 슬라이드 타이머 (호버 시 일시정지)
  useEffect(() => {
    if (isPaused || len <= 1) return;
    const timer = setInterval(goToNext, interval);
    return () => clearInterval(timer);
  }, [isPaused, interval, goToNext, len]);

  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-[0.25rem]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="flex transition-transform duration-500 ease-in-out absolute bottom-0 left-0 w-full h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((slide, index) => {
          const { src, href } =
            typeof slide === 'string' ? { src: slide } : slide;

          const slideContent = (
            <Image
              src={src}
              alt={`슬라이드 ${index + 1}`}
              fill
              className="object-cover object-bottom"
              // 충분한 해상도 선택을 위한 sizes와 품질 향상
              sizes="100vw"
              quality={90}
              priority
            />
          );

          if (href) {
            return (
              <a
                key={index}
                href={href}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="relative flex-shrink-0 w-full h-full"
              >
                {slideContent}
              </a>
            );
          }

          return (
            <div key={index} className="relative flex-shrink-0 w-full h-full">
              {slideContent}
            </div>
          );
        })}
      </div>

      {len > 1 && (
        <button
          onClick={goToPrevious}
          className="absolute left-2 bottom-[6.8rem] bg-white/80 hover:bg-white rounded-full p-1 transition-all shadow-md hover:shadow-lg flex-center"
          aria-label="이전 슬라이드"
        >
          <IconChevronLeft size={16} className="text-gray-800" />
        </button>
      )}

      {len > 1 && (
        <button
          onClick={goToNext}
          className="absolute right-2 bottom-[6.8rem] bg-white/80 hover:bg-white rounded-full p-1 transition-all shadow-md hover:shadow-lg flex-center"
          aria-label="다음 슬라이드"
        >
          <IconChevronRight size={16} className="text-gray-800" />
        </button>
      )}

      {len > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-6'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`슬라이드 ${index + 1}로 이동`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
