'use client';

import { useState, useEffect, useCallback } from 'react';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import Image from 'next/image';

interface AutoCarouselProps {
  /** 자동 슬라이드 간격 (밀리초) */
  interval?: number;
}

/**
 * 자동 슬라이드 캐러셀 컴포넌트
 * - 자동으로 이미지가 전환됩니다
 * - 마우스 호버 시 일시정지됩니다
 * - 좌/우 화살표로 수동 제어 가능합니다
 * - 하단 인디케이터로 현재 위치를 표시합니다
 */
export default function AutoCarousel({ interval = 3000 }: AutoCarouselProps) {
  // 현재는 하나의 이미지만 사용하지만, 확장을 위해 배열로 관리
  const images = ['/icon/carousel.svg'];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // 다음 슬라이드로 이동
  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  // 이전 슬라이드로 이동
  const goToPrevious = useCallback(() => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length,
    );
  }, [images.length]);

  // 특정 슬라이드로 이동
  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // 자동 슬라이드 효과
  useEffect(() => {
    if (isPaused || images.length <= 1) return;

    const timer = setInterval(goToNext, interval);
    return () => clearInterval(timer);
  }, [isPaused, interval, goToNext, images.length]);

  return (
    <div
      className="relative w-full h-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 이미지 슬라이드 */}
      <div
        className="flex transition-transform duration-500 ease-in-out absolute bottom-0 left-0 w-full h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, index) => (
          <div
            key={index}
            className="relative flex-shrink-0 w-full h-full rounded-[0.25rem]"
          >
            <Image
              src={src}
              alt={`슬라이드 ${index + 1}`}
              fill
              className="object-cover object-bottom"
              priority
            />
          </div>
        ))}
      </div>

      {/* 좌측 화살표 버튼 */}
      {images.length > 1 && (
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-all shadow-md hover:shadow-lg"
          aria-label="이전 슬라이드"
        >
          <IconChevronLeft size={24} className="text-gray-800" />
        </button>
      )}

      {/* 우측 화살표 버튼 */}
      {images.length > 1 && (
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-all shadow-md hover:shadow-lg"
          aria-label="다음 슬라이드"
        >
          <IconChevronRight size={24} className="text-gray-800" />
        </button>
      )}

      {/* 하단 인디케이터 점 */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
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
