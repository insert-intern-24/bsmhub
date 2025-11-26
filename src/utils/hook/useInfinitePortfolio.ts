'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { PortfolioData } from '@/app/components/portfolio/types';

export function useInfinitePortfolio() {
  const [data, setData] = useState<PortfolioData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);
  const initializedRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    let retryCount = 0;
    const maxRetries = 1;

    while (retryCount <= maxRetries) {
      try {
        const response = await fetch(
          `/api/portfolio/paginated?page=${pageRef.current}&limit=5`,
        );
        const result = await response.json();

        if (result.data && result.data.length > 0) {
          setData((prev) => {
            const existing = new Set(prev.map((item) => item.profile.name));
            const newData = result.data.filter(
              (item: PortfolioData) => !existing.has(item.profile.name),
            );
            return [...prev, ...newData];
          });
          pageRef.current += 1;

          if (result.data.length < 5) {
            setHasMore(false);
          }
        } else {
          setHasMore(false);
        }
        setError(null); // 성공 시 에러 초기화
        break; // 성공하면 루프 종료
      } catch (err) {
        retryCount += 1;
        if (retryCount > maxRetries) {
          console.error('Failed to load portfolio data after retry', err);
          setError('데이터 로드 실패');
        } else {
          // 재시도 전 짧은 대기
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
    }
    setIsLoading(false);
  }, [isLoading, hasMore]);

  useEffect(() => {
    // 초기화 플래그로 중복 호출 방지
    if (!initializedRef.current) {
      initializedRef.current = true;
      loadMore();
    }
  }, [loadMore]);

  return { data, isLoading, error, loadMore, hasMore };
}
