'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { PortfolioData } from '@/app/components/portfolio/types';

export function useInfinitePortfolio() {
  const [data, setData] = useState<PortfolioData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
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
    } catch (err) {
      console.error('Failed to load portfolio data', err);
      setError('데이터 로드 실패');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore]);

  useEffect(() => {
    loadMore();
  }, [loadMore]);

  return { data, isLoading, error, loadMore, hasMore };
}
