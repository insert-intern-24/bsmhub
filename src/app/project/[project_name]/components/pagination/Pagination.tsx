'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

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
  direction,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
  direction: 'prev' | 'next';
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="h-10 px-3 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 flex items-center gap-1"
  >
    {direction === 'prev' && <IconChevronLeft size={20} stroke={2} />}
    <span className="text-[17px] text-[#464c53]">{label}</span>
    {direction === 'next' && <IconChevronRight size={20} stroke={2} />}
  </button>
);

export default function InfinitePagination<T>({
  queryKey,
  queryFn,
  enabled = true,
  renderItem,
}: PaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // 화면 크기에 따라 페이지당 아이템 수 설정
  useEffect(() => {
    const handleResize = () => {
      // lg 브레이크포인트(1024px) 이상이면 24개, 이하면 8개
      setItemsPerPage(window.innerWidth >= 1024 ? 24 : 8);
    };

    // 초기 설정
    handleResize();

    // 리사이즈 이벤트 리스너 등록
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { data, fetchNextPage, hasNextPage, isFetching, error } =
    useInfiniteQuery({
      queryKey,
      queryFn,
      enabled,
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined,
    });

  // queryKey가 변경될 때 페이지를 1로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [queryKey]);

  // 전체 데이터를 하나의 배열로 병합
  const allData = data?.pages.flatMap((page) => page.data) || [];

  // 현재 페이지당 아이템 수에 따른 총 페이지 수 계산
  const totalPages = Math.ceil(allData.length / itemsPerPage);

  // 현재 페이지의 데이터만 추출
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = allData.slice(startIndex, endIndex);

  const handlePageChange = async (page: number) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);

    // 필요한 데이터가 아직 로드되지 않았다면 추가 로드
    const requiredItems = page * itemsPerPage;
    if (requiredItems > allData.length && hasNextPage) {
      await fetchNextPage();
    }
  };

  // 페이지 변경 시 스크롤을 최상단으로 이동
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // itemsPerPage 변경 시 현재 페이지 재조정
  useEffect(() => {
    const maxPage = Math.ceil(allData.length / itemsPerPage);
    if (currentPage > maxPage && maxPage > 0) {
      setCurrentPage(maxPage);
    }
  }, [itemsPerPage, allData.length, currentPage]);

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
                {renderItem(item, startIndex + index)}
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
        <div className="w-full text-center text-gray-500 py-4">로드 중...</div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 w-full">
          <NavButton
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isFetching}
            label="이전"
            direction="prev"
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
            direction="next"
          />
        </div>
      )}
    </div>
  );
}
