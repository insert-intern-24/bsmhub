'use client';

import React, { useState, ChangeEvent, useMemo, useCallback } from 'react';
import Inputs from '@/app/components/ui/input/SingleInput';
import InfinitePagination from '@/shared/ui/InfinitePagination';
import Tabs, { TabMode } from '@/app/components/layout/tabs/Tabs';
import Card, { CardProps } from '@/app/components/card/project/ProjectCard';
import PortfolioCard from '@/app/components/card/portfolio/PortfolioCard';
import { PortfolioCardProps } from '@/app/components/card/portfolio/types';
import { useSearchParams } from 'next/navigation';
import { PROJECT_TABS, TEAM_TABS, OFFICIAL_TAB, ALL_TAB } from './constants';

interface CollectClientProps {
  initialProjects?: CardProps[];
  initialPortfolios?: PortfolioCardProps[];
  type?: 'project' | 'team';
  profileName?: string;
}

/**
 * 포트폴리오 카드를 렌더링하는 helper 함수
 */
const renderPortfolioCard = (portfolio: PortfolioCardProps, index: number) => (
  <PortfolioCard
    key={index}
    profile={portfolio.profile}
    projects={portfolio.projects}
    src={`/team/${encodeURIComponent(portfolio.profile.name)}`}
  />
);

/**
 * 프로젝트 카드를 렌더링하는 helper 함수
 */
const renderProjectCard = (project: CardProps) => (
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
);

export default function CollectClient({
  initialProjects = [],
  initialPortfolios = [],
  type = 'project',
  profileName,
}: CollectClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const searchParams = useSearchParams();
  const currentTab = (searchParams.get('path') ?? 'all') as TabMode;

  const handleSearchChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setSearchTerm(e.target.value);
  };

  const filteredPortfolios = useMemo(() => {
    if (type !== 'team') return [];

    let filtered = initialPortfolios;

    // 탭에 따른 필터링 (전공동아리/일반동아리)
    if (currentTab === OFFICIAL_TAB) {
      filtered = filtered.filter((portfolio) => portfolio.isOfficial === true);
    } else if (currentTab !== ALL_TAB) {
      // 'general' 탭일 때
      filtered = filtered.filter((portfolio) => portfolio.isOfficial !== true);
    }

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
  }, [initialPortfolios, searchTerm, type, currentTab]);

  const filteredProjects = useMemo(() => {
    if (type === 'team') return [];

    // 프로젝트 타입인 경우 카테고리별 필터링
    let filtered = initialProjects;

    // 탭에 따른 필터링 (웹, 데스크톱, 모바일)
    if (currentTab !== ALL_TAB) {
      // currentTab이 'Web', 'Desktop Utility', 'Mobile' 중 하나일 때 필터링
      // project_category 테이블의 category_name과 정확히 매칭
      filtered = filtered.filter((project) => project.category === currentTab);
    }

    // 검색어 필터링
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

  // 페이지네이션 없이 그리드로 렌더링하는 공통 컴포넌트
  const renderStaticGrid = useCallback(() => {
    if (type === 'team') {
      return (
        <div className="grid grid-cols-auto-fit-card gap-6 w-full">
          {filteredPortfolios.map((portfolio, index) => (
            <PortfolioCard
              key={index}
              profile={portfolio.profile}
              projects={portfolio.projects}
              src={`/team/${encodeURIComponent(portfolio.profile.name)}`}
            />
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-auto-fit-card gap-6 w-full">
        {filteredProjects.map((project) => (
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
        ))}
      </div>
    );
  }, [type, filteredPortfolios, filteredProjects]);

  // 페이지네이션을 사용하여 렌더링하는 공통 컴포넌트
  const renderPaginatedList = useCallback(() => {
    if (type === 'team') {
      return (
        <InfinitePagination<PortfolioCardProps>
          queryKey={['portfolios', searchTerm, currentTab, type, profileName]}
          queryFn={fetchPortfolios}
          enabled={true}
          renderItem={renderPortfolioCard}
        />
      );
    }

    return (
      <InfinitePagination<CardProps>
        queryKey={['projects', searchTerm, currentTab, type, profileName]}
        queryFn={fetchProjects}
        enabled={true}
        renderItem={renderProjectCard}
      />
    );
  }, [
    type,
    searchTerm,
    currentTab,
    fetchPortfolios,
    fetchProjects,
    profileName,
  ]);

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

      {/* 프로젝트 및 팀 타입별로 다른 탭 표시 */}
      <Tabs tabs={type === 'project' ? PROJECT_TABS : TEAM_TABS} />

      {/* 전공 동아리(official)는 페이지네이션 없이 모두 표시, 나머지는 페이지네이션 사용 */}
      {currentTab === OFFICIAL_TAB ? renderStaticGrid() : renderPaginatedList()}
    </div>
  );
}
