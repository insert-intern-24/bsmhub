'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { PortfolioData } from '@/app/components/portfolio/types';

export function useInfinitePortfolio(initialData: PortfolioData[] = []) {
  const [data, setData] = useState<PortfolioData[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(initialData.length > 0 ? 2 : 1); // 초기 데이터가 있으면 다음 페이지부터 시작
  const initializedRef = useRef(initialData.length > 0); // 초기 데이터가 있으면 이미 초기화된 것으로 간주

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/portfolio/paginated?page=${pageRef.current}&limit=5`,
        {
          // 브라우저 캐시 활용 (API Route의 Cache-Control 헤더에 따라 캐시됨)
          cache: 'default',
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      // hasMore 판단 통합: result.hasMore가 있으면 사용, 없으면 데이터 길이로 판단
      const limit = 5;
      setHasMore(result.hasMore ?? result.data.length >= limit);

      if (result.data && result.data.length > 0) {
        setData((prev) => {
          const existing = new Set(prev.map((item) => item.profile.name));
          const newData = result.data.filter(
            (item: PortfolioData) => !existing.has(item.profile.name),
          );
          // 후반에 들어온 데이터를 배열의 앞에 삽입
          return [...newData, ...prev];
        });
        pageRef.current += 1;
      }

      setError(null);
    } catch (err) {
      console.error('Failed to load portfolio data', err);
      setError(err instanceof Error ? err.message : '데이터 로드 실패');
    } finally {
      setIsLoading(false);
    }
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
