'use client';

import React, { useState, ChangeEvent, useMemo, useCallback } from 'react';
import Inputs from '@/app/components/modal/inputs/SingleInput';
import InfinitePagination from '@/shared/ui/InfinitePagination';
import Tabs, { TabMode } from '@/app/components/layout/Tabs';
import Card, { CardProps } from '@/app/components/card/project/ProjectCard';
import PortfolioCard from '@/app/components/card/portfolio/PortfolioCard';
import { PortfolioCardProps } from '@/app/components/card/portfolio/types';
import { useSearchParams } from 'next/navigation';
import {
  PROJECT_TABS,
  TEAM_TABS,
  OFFICIAL_TAB,
  ALL_TAB,
} from './constants';

interface CollectClientProps {
  initialProjects?: CardProps[];
  initialPortfolios?: PortfolioCardProps[];
  type?: 'project' | 'team';
}

/**
 * 포트폴리오 카드를 렌더링하는 helper 함수
 */
const renderPortfolioCard = (
  portfolio: PortfolioCardProps,
  index: number,
) => (
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

    let filtered = initialProjects;

    // 탭에 따른 카테고리 필터링
    if (currentTab !== ALL_TAB) {
      filtered = filtered.filter(
        (project) => project.category === currentTab,
      );
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

      {/* 팀 타입일 때는 포트폴리오 카드로 렌더링 */}
      {type === 'team' ? (
        currentTab === OFFICIAL_TAB ? (
          // 전공 동아리는 페이지네이션 없이 모두 표시
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {filteredPortfolios.map(renderPortfolioCard)}
          </div>
        ) : (
          // 전체 및 일반 동아리는 페이지네이션 사용
          <InfinitePagination<PortfolioCardProps>
            queryKey={['portfolios', searchTerm, currentTab, type]}
            queryFn={fetchPortfolios}
            enabled={true}
            renderItem={renderPortfolioCard}
          />
        )
      ) : currentTab === OFFICIAL_TAB ? (
        // 전공 동아리는 페이지네이션 없이 모두 표시
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {filteredProjects.map(renderProjectCard)}
        </div>
      ) : (
        // 전체 및 일반 동아리는 페이지네이션 사용
        <InfinitePagination<CardProps>
          queryKey={['projects', searchTerm, currentTab, type]}
          queryFn={fetchProjects}
          enabled={true}
          renderItem={renderProjectCard}
        />
      )}
    </div>
  );
}
