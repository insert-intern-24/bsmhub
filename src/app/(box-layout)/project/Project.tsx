'use client';

import React, { useState, ChangeEvent, useMemo, useCallback } from 'react';
import Inputs from '@/app/components/modal/inputs/SingleInput';
import InfinitePagination from '@/app/project/[project_name]/components/pagination/Pagination';
import Tabs from '@/app/project/[project_name]/components/tabs/ProjectTab';
import Card, { CardProps } from '@/app/components/card/project/ProjectCard';

interface ProjectClientProps {
  initialProjects: CardProps[];
}

export default function ProjectClient({ initialProjects }: ProjectClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  const filteredProjects = useMemo(() => {
    // 탭 인덱스와 데이터베이스 카테고리 매핑
    const categoryMap: { [key: number]: string } = {
      0: 'Web',
      1: 'Desktop Utility',
      2: 'Mobile',
    };

    const selectedCategory = categoryMap[activeTab];

    let filtered = initialProjects;

    // 카테고리 필터링
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
  }, [initialProjects, searchTerm, activeTab]);

  // 페이지네이션 함수 - useCallback으로 메모이제이션
  const fetchProjects = useCallback(
    async ({ pageParam }: { pageParam: number }) => {
      const limit = 8;
      const startIndex = (pageParam - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = filteredProjects.slice(startIndex, endIndex);

      return {
        data: paginatedData,
        totalPages: Math.ceil(filteredProjects.length / limit),
        currentPage: pageParam,
        hasNextPage: pageParam < Math.ceil(filteredProjects.length / limit),
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

      <Tabs activeTab={activeTab} onTabChange={handleTabChange} />

      <InfinitePagination<CardProps>
        queryKey={['projects', searchTerm, activeTab]}
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
