'use client';

import React from 'react';
import Link from 'next/link';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

interface ViewerPaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

const ViewerPagination = ({
  currentPage,
  totalPages,
  basePath = '/viewer',
}: ViewerPaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = (): (number | string)[] => {
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

  const pages = getPageNumbers();

  const PageButton = ({
    page,
    active,
    href,
  }: {
    page: number;
    active: boolean;
    href: string;
  }) => (
    <Link
      href={href}
      className={`w-10 h-10 rounded-md transition-colors text-[17px] flex items-center justify-center ${
        active
          ? 'bg-[#171717] text-white font-bold'
          : 'text-[#464c53] hover:bg-gray-100'
      }`}
    >
      {page}
    </Link>
  );

  const NavButton = ({
    href,
    disabled,
    label,
    direction,
  }: {
    href: string;
    disabled: boolean;
    label: string;
    direction: 'prev' | 'next';
  }) => (
    <Link
      href={href}
      className={`h-10 px-3 rounded-md transition-colors flex items-center gap-1 ${
        disabled
          ? 'opacity-40 cursor-not-allowed pointer-events-none'
          : 'hover:bg-gray-100'
      }`}
    >
      {direction === 'prev' && <IconChevronLeft size={20} stroke={2} />}
      <span className="text-[17px] text-[#464c53]">{label}</span>
      {direction === 'next' && <IconChevronRight size={20} stroke={2} />}
    </Link>
  );

  return (
    <div className="flex items-center justify-center gap-2 w-full mt-8">
      <NavButton
        href={`${basePath}?page=${currentPage - 1}`}
        disabled={currentPage === 1}
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
            href={`${basePath}?page=${page}`}
          />
        ),
      )}

      <NavButton
        href={`${basePath}?page=${currentPage + 1}`}
        disabled={currentPage === totalPages}
        label="다음"
        direction="next"
      />
    </div>
  );
};

export default ViewerPagination;

