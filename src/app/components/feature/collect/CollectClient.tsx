'use client';

import React, { useState, ChangeEvent, useMemo } from 'react';
import Inputs from '@/app/components/ui/input/SingleInput';
import InfinitePagination from '@/shared/ui/InfinitePagination';
import Tabs, { TabMode } from '@/app/components/layout/tabs/Tabs';
import Card, { CardProps } from '@/app/components/card/project/ProjectCard';
import PortfolioCard from '@/app/components/card/portfolio/PortfolioCard';
import { PortfolioCardProps } from '@/app/components/card/portfolio/types';
import { useSearchParams } from 'next/navigation';
import { PROJECT_TABS, TEAM_TABS, OFFICIAL_TAB, ALL_TAB } from './constants';
import { Title } from '@/app/components/ui/text/text';
import { getFoundedYear } from '@/utils/date';

interface CollectClientProps {
  initialProjects?: CardProps[];
  initialPortfolios?: PortfolioCardProps[];
  type?: 'project' | 'team';
  profileName?: string;
}

const renderPortfolioCard = (portfolio: PortfolioCardProps, index: number) => (
  <PortfolioCard
    key={index}
    profile={portfolio.profile}
    projects={portfolio.projects}
    src={`/team/${encodeURIComponent(portfolio.profile.name)}`}
  />
);

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
  const defaultTab = type === 'team' ? TEAM_TABS[0] : PROJECT_TABS[0];
  const currentTab = (searchParams.get('path') ?? defaultTab) as TabMode;

  const handleSearchChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setSearchTerm(e.target.value);
  };

  const filteredPortfolios = useMemo(() => {
    if (type !== 'team') return [];

    let filtered = initialPortfolios.filter(
      (portfolio) =>
        currentTab === OFFICIAL_TAB
          ? portfolio.isOfficial === true
          : portfolio.isOfficial !== true,
    );

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (portfolio) =>
          portfolio.profile.name.toLowerCase().includes(term) ||
          portfolio.profile.bio.toLowerCase().includes(term),
      );
    }

    return filtered;
  }, [initialPortfolios, searchTerm, type, currentTab]);

  const filteredProjects = useMemo(() => {
    if (type === 'team') return [];

    let filtered = initialProjects.filter(
      (project) => currentTab === ALL_TAB || project.category === currentTab,
    );

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          (project.title ?? '').toLowerCase().includes(term) ||
          project.description.toLowerCase().includes(term) ||
          project.ownerName.toLowerCase().includes(term),
      );
    }

    return filtered;
  }, [initialProjects, searchTerm, currentTab, type]);

  const teamPortfolios = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const withTitle: PortfolioCardProps[] = [];
    const withoutTitle: PortfolioCardProps[] = [];
    let generationTitle: string | undefined;

    filteredPortfolios.forEach((portfolio) => {
      if (portfolio.createdAt) {
        const foundedYear = getFoundedYear(portfolio.createdAt);
        if (foundedYear === currentYear) {
          // 창립 연도와 현재 연도를 기반으로 기수 계산
          const generation = currentYear - foundedYear + 1;
          const title = portfolio.isOfficial
            ? `${generation}기 전공동아리`
            : `${currentYear}년 일반동아리`;
          if (!generationTitle) generationTitle = title;
          withTitle.push(portfolio);
          return;
        }
      }
      withoutTitle.push(portfolio);
    });

    return { withTitle, withoutTitle, generationTitle };
  }, [filteredPortfolios]);

  const createFetchFn = <T,>(data: T[]) => async ({ pageParam }: { pageParam: number }) => ({
    data,
    totalPages: 1,
    currentPage: pageParam,
    hasNextPage: false,
  });

  const renderTeamPortfolios = (usePagination: boolean) => (
    <div className="w-full flex flex-col gap-4">
      {teamPortfolios.generationTitle && (
        <>
          <Title className="px-1">{teamPortfolios.generationTitle}</Title>
          {usePagination ? (
            <InfinitePagination<PortfolioCardProps>
              queryKey={['portfolios', searchTerm, currentTab, type, profileName, 'with-title']}
              queryFn={createFetchFn(teamPortfolios.withTitle)}
              enabled={true}
              renderItem={renderPortfolioCard}
            />
          ) : (
            <div className="grid grid-cols-auto-fit-card gap-6 w-full">
              {teamPortfolios.withTitle.map((portfolio, index) => renderPortfolioCard(portfolio, index))}
            </div>
          )}
        </>
      )}
      {teamPortfolios.withoutTitle.length > 0 && (
        usePagination ? (
          <InfinitePagination<PortfolioCardProps>
            queryKey={['portfolios', searchTerm, currentTab, type, profileName, 'without-title']}
            queryFn={createFetchFn(teamPortfolios.withoutTitle)}
            enabled={true}
            renderItem={renderPortfolioCard}
          />
        ) : (
          <div className="grid grid-cols-auto-fit-card gap-6 w-full">
            {teamPortfolios.withoutTitle.map((portfolio, index) => renderPortfolioCard(portfolio, index))}
          </div>
        )
      )}
    </div>
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

      <Tabs tabs={type === 'project' ? PROJECT_TABS : TEAM_TABS} />

      {type === 'team' ? (
        renderTeamPortfolios(currentTab !== OFFICIAL_TAB)
      ) : currentTab === OFFICIAL_TAB ? (
        <div className="grid grid-cols-auto-fit-card gap-6 w-full">
          {filteredProjects.map(renderProjectCard)}
        </div>
      ) : (
        <InfinitePagination<CardProps>
          queryKey={['projects', searchTerm, currentTab, type, profileName]}
          queryFn={createFetchFn(filteredProjects)}
          enabled={true}
          renderItem={renderProjectCard}
        />
      )}
    </div>
  );
}
