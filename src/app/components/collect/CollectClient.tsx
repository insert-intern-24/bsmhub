'use client';

import React, { useState, ChangeEvent, useMemo, useCallback } from 'react';
import Inputs from '@/app/components/modal/inputs/SingleInput';
import InfinitePagination from '@/app/project/[project_name]/components/pagination/Pagination';
import Tabs, { TabMode } from '@/app/components/layout/Tabs';
import ProjectCard, { CardProps } from '@/app/components/card/project/ProjectCard';
import PortfolioCard from '@/app/components/card/portfolio/PortfolioCard';
import { PortfolioCardProps } from '@/app/components/card/portfolio/types';
import { useSearchParams } from 'next/navigation';

interface CollectClientProps {
  initialProjects?: CardProps[];
  initialPortfolios?: PortfolioCardProps[];
  type?: 'project' | 'team';
}

export default function CollectClient({
  initialProjects = [],
  initialPortfolios = [],
  type = 'project',
}: CollectClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const searchParams = useSearchParams();
  const currentTab = (searchParams.get('path') ?? 'all') as TabMode;

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredPortfolios = useMemo(() => {
    if (type !== 'team') return [];

    let filtered = initialPortfolios;

    // 검색어 필터링
    if (searchTerm) {
      filtered = filtered.filter(
        (portfolio) =>
          portfolio.profile.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          portfolio.profile.bio
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    return filtered;
  }, [initialPortfolios, searchTerm, type]);

  const filteredProjects = useMemo(() => {
    if (type === 'team') return [];

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
          (project.title ?? '')
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
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

  const fetchPortfolios = useCallback(
    async ({ pageParam }: { pageParam: number }) => {
      return {
        data: filteredPortfolios,
        totalPages: 1,
        currentPage: pageParam,
        hasNextPage: false,
      };
    },
    [filteredPortfolios],
  );

  return (
    <div className="flex flex-col items-start gap-6 flex-1 shrink-0">
      <div className="w-full max-w-[25rem] mobile:max-w-full">
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

      {/* 팀 타입일 때는 포트폴리오 카드로 렌더링 */}
      {type === 'team' ? (
        <InfinitePagination<PortfolioCardProps>
          queryKey={['portfolios', searchTerm, type]}
          queryFn={fetchPortfolios}
          enabled={true}
          renderItem={(portfolio, index) => (
            <PortfolioCard
              key={index}
              profile={portfolio.profile}
              projects={portfolio.projects}
              src={`/team/${encodeURIComponent(portfolio.profile.name)}`}
            />
          )}
        />
      ) : (
        <InfinitePagination<CardProps>
          queryKey={['projects', searchTerm, currentTab, type]}
          queryFn={fetchProjects}
          enabled={true}
          renderItem={(project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              title={project.title}
              description={project.description}
              projectImage={project.projectImage}
              ownerName={project.ownerName}
              ownerProfileImage={project.ownerProfileImage}
              isTeam={project.isTeam}
              category={project.category}
              authors={project.authors}
            />
          )}
        />
      )}
    </div>
  );
}
