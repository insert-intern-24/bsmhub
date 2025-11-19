'use client';

import { useState, useMemo } from 'react';
import PortfolioCard from '@/app/components/card/portfolio/PortfolioCard';
import { PortfolioData } from './types';
import Inputs from '@/app/components/modal/inputs/SingleInput';
import Checkbox from '@/app/components/modal/inputs/Checkbox';
import { Body } from '@/app/components/shared/system/text';
import { Tables } from '@/services/supabase/database.types';

const JOB_SEEKING_STATUS = ['구직 중', 'jobseeking'];
const EMPLOYED_STATUS = ['취직 중', 'employed'];

interface FilterState {
  jobs: string[];
  showOnlyJobSeeking: boolean;
  showOnlyEmployed: boolean;
}

export default function PortfolioSearchTab({
  portfolioData,
  jobs,
}: {
  portfolioData: PortfolioData[];
  jobs: Tables<'jobs'>[];
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterState>({
    jobs: [],
    showOnlyJobSeeking: false,
    showOnlyEmployed: false,
  });

  // 필터링된 데이터 (useMemo로 최적화)
  const filteredData = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();

    return portfolioData.filter((data) => {
      // 검색어 필터링
      if (lowerSearchTerm) {
        const matchesSearch =
          data.profile.name.toLowerCase().includes(lowerSearchTerm) ||
          data.student?.name.toLowerCase().includes(lowerSearchTerm) ||
          data.projects.some(
            (project) =>
              project.title.toLowerCase().includes(lowerSearchTerm) ||
              project.description.toLowerCase().includes(lowerSearchTerm),
          );
        if (!matchesSearch) return false;
      }

      // 직무 필터링
      if (filter.jobs.length > 0) {
        const matchesJob = data.profile.role.some((role) =>
          filter.jobs.includes(role),
        );
        if (!matchesJob) return false;
      }

      // 고용 상태 필터링
      const { showOnlyJobSeeking, showOnlyEmployed } = filter;
      if (showOnlyJobSeeking !== showOnlyEmployed) {
        const status = data.profile.status;
        if (showOnlyJobSeeking && !JOB_SEEKING_STATUS.includes(status))
          return false;
        if (showOnlyEmployed && !EMPLOYED_STATUS.includes(status))
          return false;
      }

      return true;
    });
  }, [portfolioData, searchTerm, filter]);

  // 핸들러 함수들
  const handleJobFilter = (jobName: string, checked: boolean) => {
    setFilter((prev) => ({
      ...prev,
      jobs: checked
        ? [...prev.jobs, jobName]
        : prev.jobs.filter((name) => name !== jobName),
    }));
  };

  const handleEmploymentFilter = (
    filterType: 'jobSeeking' | 'employed',
    checked: boolean,
  ) => {
    setFilter((prev) => ({
      ...prev,
      [filterType === 'jobSeeking' ? 'showOnlyJobSeeking' : 'showOnlyEmployed']:
        checked,
    }));
  };
  return (
    <div className="pt-8 flex mobile:flex-col flex-row gap-4 min-h-dvh w-full">
      {/* 검색 및 필터 사이드바 */}
      <aside className="flex-col gap-3 min-w-[25rem]">
        <Inputs
          icon="search"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
        />

        <div className="flex-col gap-3 p-2">
          {/* 직무분야 필터 */}
          <Body>직무분야</Body>
          <div className="flex-col gap-1">
            {jobs.map((job) => (
              <Checkbox
                label={job.job_name}
                key={job.job_id}
                onChange={(checked) => handleJobFilter(job.job_name, checked)}
              />
            ))}
          </div>

          {/* 옵션 필터 */}
          <Body>옵션</Body>
          <div className="flex-col gap-1">
            <Checkbox
              label="구직 중만 표시"
              onChange={(checked) =>
                handleEmploymentFilter('jobSeeking', checked)
              }
            />
            <Checkbox
              label="취직 중만 표시"
              onChange={(checked) =>
                handleEmploymentFilter('employed', checked)
              }
            />
          </div>
        </div>
      </aside>

      {/* 포트폴리오 목록 */}
      <section className="flex-col gap-3 p-4 flex-1 bg-[#FAFAFA] rounded-lg">
        {filteredData.length > 0 ? (
          filteredData.map((data, index) => (
            <PortfolioCard
              key={index}
              profile={data.profile}
              projects={data.projects}
              src={`/portfolio/${encodeURIComponent(data.profile.name)}`}
            />
          ))
        ) : (
          <div className="text-center text-gray-500">
            {portfolioData.length === 0
              ? '포트폴리오 데이터가 없습니다'
              : '검색 조건에 맞는 포트폴리오가 없습니다'}
          </div>
        )}
      </section>
    </div>
  );
}

