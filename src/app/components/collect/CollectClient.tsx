'use client';

import React, { useState, ChangeEvent, useMemo, useCallback } from 'react';
import Inputs from '@/app/components/modal/inputs/SingleInput';
import InfinitePagination from '@/app/project/[project_name]/components/pagination/Pagination';
import Tabs, { TabMode } from '@/app/components/layout/Tabs';
import Card, { CardProps } from '@/app/components/card/project/ProjectCard';
import { useSearchParams } from 'next/navigation';

interface CollectClientProps {
  initialProjects: CardProps[];
  type?: 'project' | 'team';
}

export default function CollectClient({
  initialProjects,
  type = 'project',
}: CollectClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const searchParams = useSearchParams();
  const currentTab = (searchParams.get('path') ?? 'all') as TabMode;

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredProjects = useMemo(() => {
    // 타입이 팀인 경우 카테고리 필터링 스킵
    if (type === 'team') {
      let filtered = initialProjects;

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
    }

    // 프로젝트 타입인 경우 기존 로직 유지
    const categoryMap: Record<TabMode, string | null> = {
      home: null,
      project: null,
      all: null,
      web: 'Web',
      desktop: 'Desktop Utility',
      mobile: 'Mobile',
    };

    const selectedCategory = categoryMap[currentTab];
    let filtered = initialProjects;

    if (selectedCategory) {
      filtered = filtered.filter(
        (project) => project.category === selectedCategory,
      );
    }

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
  }, [initialProjects, searchTerm, currentTab, type]);

  const fetchProjects = useCallback(
    async ({ pageParam }: { pageParam: number }) => {
      return {
        data: filteredProjects,
        totalPages: 1,
        currentPage: pageParam,
        hasNextPage: false,
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

      {/* 프로젝트 타입일 때만 탭 표시 */}
      {type === 'project' && (
        <Tabs tabs={['all', 'web', 'desktop', 'mobile']} />
      )}

      <InfinitePagination<CardProps>
        queryKey={['projects', searchTerm, currentTab, type]}
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
