'use client';

import { useState, useEffect, useCallback } from 'react';
import { PortfolioData } from '@/app/(box-layout)/portfolio/types';

export function useInfinitePortfolio() {
  const [data, setData] = useState<PortfolioData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const loadMore = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/portfolio/paginated?page=${page}&limit=5`);
      const result = await response.json();

      if (result.data) {
        setData((prev) => {
          const existing = new Set(prev.map((item) => item.profile.name));
          const newData = result.data.filter((item: PortfolioData) => !existing.has(item.profile.name));
          return [...prev, ...newData];
        });
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      console.error('Failed to load portfolio data', err);
      setError('데이터 로드 실패');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, page]);

  useEffect(() => {
    loadMore();
  }, [loadMore]);

  return { data, isLoading, error, loadMore };
}
