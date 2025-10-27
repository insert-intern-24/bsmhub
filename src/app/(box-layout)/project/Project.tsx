'use client';

import React, { useState, ChangeEvent, useMemo, useCallback } from 'react';
import Inputs from '@/app/components/modal/inputs/SingleInput';
import InfinitePagination from '@/app/project/[project_name]/components/pagination/Pagination';
import Tabs, { TabMode } from '@/app/components/layout/Tabs';
import Card, { CardProps } from '@/app/components/card/project/ProjectCard';
import { useSearchParams } from 'next/navigation';

interface ProjectClientProps {
  initialProjects: CardProps[];
}

export default function ProjectClient({ initialProjects }: ProjectClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const searchParams = useSearchParams();
  const currentTab = (searchParams.get('path') ?? 'all') as TabMode;

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredProjects = useMemo(() => {
    // 탭과 데이터베이스 카테고리 매핑
    const categoryMap: Record<TabMode, string | null> = {
      home: null,
      project: null,
      all: null, // 전체: 모든 카테고리 표시
      web: 'Web',
      desktop: 'Desktop Utility',
      mobile: 'Mobile',
    };

    const selectedCategory = categoryMap[currentTab];
    let filtered = initialProjects;

    // 카테고리 필터링 (all인 경우 필터링하지 않음)
    if (selectedCategory) {
      filtered = filtered.filter(
        (project) => project.category === selectedCategory,
      );
    }

    // 검색어 필터링
    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          project.ownerName.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    return filtered;
  }, [initialProjects, searchTerm, currentTab]);

  // 페이지네이션 함수 - useCallback으로 메모이제이션
  const fetchProjects = useCallback(
    async ({ pageParam }: { pageParam: number }) => {
      // Pagination 컴포넌트에서 클라이언트 측 페이지네이션을 처리하므로
      // 여기서는 전체 데이터를 반환
      return {
        data: filteredProjects,
        totalPages: 1, // 전체 데이터를 한 번에 반환
        currentPage: pageParam,
        hasNextPage: false, // 추가 페이지 없음
      };
    },
    [filteredProjects],
  );

  return (
    <div className="flex flex-col items-start gap-6 flex-1 shrink-0">
      <div className="w-full max-w-[25rem]">
        <Inputs
          type="text"
          icon="search"
          placeholder="Search"
          onChange={handleSearchChange}
        />
      </div>

      <Tabs tabs={['all', 'web', 'desktop', 'mobile']} />

      <InfinitePagination<CardProps>
        queryKey={['projects', searchTerm, currentTab]}
        queryFn={fetchProjects}
        enabled={true}
        renderItem={(project) => (
          <Card
            key={project.id}
            id={project.id}
            title={project.title}
            description={project.description}
            projectImage={project.projectImage}
            ownerName={project.ownerName}
            isTeam={project.isTeam}
            category={project.category}
            authors={project.authors}
          />
        )}
      />
    </div>
  );
}
