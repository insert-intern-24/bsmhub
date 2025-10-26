'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

interface PaginationProps<T> {
  queryKey: readonly unknown[];
  queryFn: ({ pageParam }: { pageParam: number }) => Promise<{
    data: T[];
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
  }>;
  enabled?: boolean;
  renderItem: (item: T, index: number) => React.ReactNode;
}

const PageButton = ({
  page,
  active,
  onClick,
}: {
  page: number;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-10 h-10 rounded-md transition-colors text-[17px] ${
      active
        ? 'bg-[#171719] text-white font-bold'
        : 'text-[#464c53] hover:bg-gray-100'
    }`}
  >
    {page}
  </button>
);

const NavButton = ({
  onClick,
  disabled,
  label,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="h-10 px-2 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
  >
    <span className="text-[17px] text-[#464c53]">{label}</span>
  </button>
);

export default function InfinitePagination<T>({
  queryKey,
  queryFn,
  enabled = true,
  renderItem,
}: PaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, fetchNextPage, hasNextPage, isFetching, error } =
    useInfiniteQuery({
      queryKey,
      queryFn,
      enabled,
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined,
    });

  const totalPages = data?.pages[0]?.totalPages || 1;

  // 현재 페이지의 데이터만 표시
  const currentPageData =
    data?.pages.find((page) => page.currentPage === currentPage)?.data || [];

  const handlePageChange = async (page: number) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);

    const isPageLoaded = data?.pages.some((p) => p.currentPage === page);
    if (!isPageLoaded && hasNextPage) {
      await fetchNextPage();
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const getPages = (): (number | string)[] => {
    if (totalPages <= 8) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, 6, 7, 8, '...', totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [
        1,
        '...',
        totalPages - 7,
        totalPages - 6,
        totalPages - 5,
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      '...',
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
      '...',
      totalPages,
    ];
  };

  const pages = getPages();

  if (error) {
    return (
      <div className="text-red-500 text-center py-8">
        데이터를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-6 w-full">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {currentPageData.length > 0
          ? currentPageData.map((item, index) => (
              <div key={index} className="w-full">
                {renderItem(item, index)}
              </div>
            ))
          : !isFetching && (
              <div className="col-span-full text-center text-gray-500 py-8">
                데이터가 없습니다.
              </div>
            )}
      </div>

      {/* 로딩 상태 */}
      {isFetching && (
        <div className="w-full text-center text-gray-500 py-4">로딩 중...</div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 w-full">
          <NavButton
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isFetching}
            label="이전"
          />

          {pages.map((page, index) =>
            page === '...' ? (
              <div
                key={`ellipsis-${index}`}
                className="w-10 h-10 flex items-center justify-center"
              >
                <span className="text-[#33363d]">...</span>
              </div>
            ) : (
              <PageButton
                key={page}
                page={page as number}
                active={currentPage === page}
                onClick={() => handlePageChange(page as number)}
              />
            ),
          )}

          <NavButton
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isFetching}
            label="다음"
          />
        </div>
      )}
    </div>
  );
}
