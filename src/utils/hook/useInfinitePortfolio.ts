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

        // HTTP 응답 상태 코드 확인
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`,
          );
        }

        const result = await response.json();

        // API 응답에 error 필드가 있는 경우 처리
        if (result.error) {
          throw new Error(result.error);
        }

        // result.hasMore를 사용하여 더 정확하게 처리
        if (result.hasMore !== undefined) {
          setHasMore(result.hasMore);
        }

        if (result.data && result.data.length > 0) {
          setData((prev) => {
            const existing = new Set(prev.map((item) => item.profile.name));
            const newData = result.data.filter(
              (item: PortfolioData) => !existing.has(item.profile.name),
            );
            return [...prev, ...newData];
          });
          pageRef.current += 1;

          // result.hasMore가 없을 때만 길이로 판단
          if (result.hasMore === undefined && result.data.length < 5) {
            setHasMore(false);
          }
        } else if (result.hasMore === undefined) {
          // hasMore 정보가 없고 데이터도 없으면 더 이상 없음으로 간주
          setHasMore(false);
        }

        setError(null); // 성공 시 에러 초기화
        break; // 성공하면 루프 종료
      } catch (err) {
        retryCount += 1;
        if (retryCount > maxRetries) {
          console.error('Failed to load portfolio data after retry', err);
          setError(
            err instanceof Error ? err.message : '데이터 로드 실패',
          );
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
