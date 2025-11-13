'use client';

import { useState } from 'react';
import PortfolioCard from '@/app/components/card/portfolio/PortfolioCard';
import { PortfolioData } from './types';
import Inputs from '@/app/components/modal/inputs/SingleInput';
import Checkbox from '@/app/components/modal/inputs/Checkbox';
import { Body } from '@/app/components/system/text';
import { Tables } from '@/services/supabase/database.types';

const JOB_SEEKING_STATUS = ['구직 중', 'jobseeking'];
const EMPLOYED_STATUS = ['취직 중', 'employed'];

interface FilterState {
  jobs: string[];
  showOnlyJobSeeking: boolean;
  showOnlyEmployed: boolean;
}

export default function SearchTab({
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

  // 필터링 함수들
  const filterBySearchTerm = (data: PortfolioData) => {
    if (!searchTerm) return true;
    return (
      data.profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.projects.some(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    );
  };

  const filterByJobs = (data: PortfolioData) => {
    if (filter.jobs.length === 0) return true;
    return data.profile.role.some((role) => filter.jobs.includes(role));
  };

  const filterByEmploymentStatus = (data: PortfolioData) => {
    const { showOnlyJobSeeking, showOnlyEmployed } = filter;
    // 둘 다 선택되거나 둘 다 선택되지 않은 경우
    if (showOnlyJobSeeking === showOnlyEmployed) return true;

    const status = data.profile.status;

    if (showOnlyJobSeeking) {
      return JOB_SEEKING_STATUS.includes(status);
    }

    if (showOnlyEmployed) {
      return EMPLOYED_STATUS.includes(status);
    }

    return true;
  };

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

  // 필터링된 데이터
  const filteredData = portfolioData
    .filter(filterBySearchTerm)
    .filter(filterByJobs)
    .filter(filterByEmploymentStatus);
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
