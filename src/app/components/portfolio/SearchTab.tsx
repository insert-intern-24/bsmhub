'use client';

import { useState, useMemo } from 'react';
import PortfolioCard from '@/app/components/card/portfolio/PortfolioCard';
import { PortfolioData } from './types';
import FilterSidebar, { FilterState } from './FilterSidebar';
import { Tables } from '@/services/supabase/database.types';

const JOB_SEEKING_STATUS = ['구직 중', 'jobseeking'];
const EMPLOYED_STATUS = ['취직 중', 'employed'];

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
    departments: [],
    showOnlyJobSeeking: false,
    showOnlyEmployed: false,
  });

  // 고유한 학과 목록 추출
  const departments = useMemo(() => {
    const deptSet = new Set<string>();
    portfolioData.forEach((data) => {
      const deptName = data.student?.department?.department_name;
      if (deptName) {
        deptSet.add(deptName);
      }
    });
    return Array.from(deptSet).sort((a, b) => a.localeCompare(b, 'ko'));
  }, [portfolioData]);

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

  const filterByDepartments = (data: PortfolioData) => {
    if (filter.departments.length === 0) return true;
    const deptName = data.student?.department?.department_name;
    return deptName ? filter.departments.includes(deptName) : false;
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

  // 필터링된 데이터
  const filteredData = portfolioData
    .filter(filterBySearchTerm)
    .filter(filterByDepartments)
    .filter(filterByJobs)
    .filter(filterByEmploymentStatus);

  return (
    <div className="pt-8 flex mobile:flex-col flex-row gap-4 min-h-dvh w-full">
      {/* 검색 및 필터 사이드바 */}
      <FilterSidebar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filter={filter}
        onFilterChange={setFilter}
        jobs={jobs}
        departments={departments}
      />

      {/* 포트폴리오 목록 */}
      <section className="flex-col gap-3 p-4 w-full bg-[#FAFAFA] rounded-lg">
        {filteredData.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {filteredData.map((data) => (
              <PortfolioCard
                key={data.profile.name}
                profile={data.profile}
                projects={data.projects}
                src={`/portfolio/${encodeURIComponent(data.profile.name)}`}
                studentName={data.student?.name}
              />
            ))}
          </div>
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
