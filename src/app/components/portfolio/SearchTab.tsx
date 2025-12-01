'use client';

import { useState, useMemo } from 'react';
import PortfolioCard from '@/app/components/card/portfolio/PortfolioCard';
import { PortfolioData } from './types';
import FilterSidebar from './FilterSidebar';
import { Tables } from '@/services/supabase/database.types';
import {
  extractUniqueDepartments,
  filterPortfolioData,
  FilterState,
  PortfolioFilterAccessors,
} from '@/utils/portfolioUtils';

// PortfolioData용 필터 접근자
const searchTabAccessors: PortfolioFilterAccessors<PortfolioData> = {
  getProfileName: (data) => data.profile.name,
  getStudentName: (data) => data.student?.name,
  getProjects: (data) =>
    data.projects.map((p) => ({
      name: p.title,
      description: p.description,
    })),
  getDepartmentName: (data) => data.student?.department?.department_name,
  getRoles: (data) => data.profile.role,
  getStatus: (data) => data.profile.status,
};

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

  // 고유한 학과 목록 추출 (공통 유틸리티 함수 사용)
  const departments = useMemo(
    () => extractUniqueDepartments(portfolioData, (data) => data.student?.department?.department_name),
    [portfolioData],
  );

  // 필터링된 데이터 (공통 유틸리티 함수 사용)
  const filteredData = filterPortfolioData(portfolioData, searchTerm, filter, searchTabAccessors);

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
