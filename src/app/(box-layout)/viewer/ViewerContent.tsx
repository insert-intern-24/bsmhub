'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import PortfolioSheet from '@/app/components/viewer/PortfolioSheet';
import FilterSidebar from '@/app/components/portfolio/FilterSidebar';
import { ViewerPortfolioData } from '@/services/portfolio/getAllViewerPortfolioData.server';
import { Tables } from '@/services/supabase/database.types';
import {
  extractUniqueDepartments,
  filterPortfolioData,
  FilterState,
  PortfolioFilterAccessors,
} from '@/utils/portfolioUtils';

interface ViewerContentProps {
  portfolioData: ViewerPortfolioData[];
  jobs: Tables<'jobs'>[];
  showFilter: boolean;
}

const getBanner = (dept: string | null): string | null => {
  if (!dept) return null;
  if (dept.includes('소프트웨어개발과') || dept.includes('소프트웨어 개발과')) return '/banner/s.png';
  if (dept.includes('임베디드소프트웨어과') || dept.includes('임베디드 소프트웨어과')) return '/banner/es.png';
  return null;
};

// ViewerPortfolioData용 필터 접근자
const viewerAccessors: PortfolioFilterAccessors<ViewerPortfolioData> = {
  getProfileName: (data) => data.profile.profile_name,
  getStudentName: (data) => data.student?.name,
  getProjects: (data) =>
    data.projects.map((p) => ({
      name: p.project_name,
      description: p.description,
    })),
  getDepartmentName: (data) => data.department?.department_name,
  getRoles: (data) => data.profile.role,
  getStatus: (data) => data.profile.status,
};

export default function ViewerContent({ portfolioData, jobs, showFilter }: ViewerContentProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterState>({
    jobs: [],
    departments: [],
    showOnlyJobSeeking: false,
    showOnlyEmployed: false,
  });

  // 고유한 학과 목록 추출 (공통 유틸리티 함수 사용)
  const departments = useMemo(
    () => extractUniqueDepartments(portfolioData, (data) => data.department?.department_name),
    [portfolioData],
  );

  // 필터링된 데이터 (공통 유틸리티 함수 사용)
  const filteredData = useMemo(() => {
    if (!showFilter) return portfolioData;
    return filterPortfolioData(portfolioData, searchTerm, filter, viewerAccessors);
  }, [portfolioData, showFilter, searchTerm, filter]);

  // 배너와 포트폴리오 아이템 생성
  const items = useMemo(() => {
    const result: Array<{ type: 'banner'; src: string } | { type: 'portfolio'; data: ViewerPortfolioData }> = [];
    let lastDept: string | null = null;

    filteredData.forEach((data) => {
      const dept = data.department?.department_name || null;
      if (dept !== lastDept) {
        const banner = getBanner(dept);
        if (banner) result.push({ type: 'banner', src: banner });
        lastDept = dept;
      }
      result.push({ type: 'portfolio', data });
    });

    return result;
  }, [filteredData]);

  if (!portfolioData?.length) {
    return (
      <div className="flex-center w-full py-8">
        <p className="text-gray-500">표시할 포트폴리오가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="pt-12 flex mobile:flex-col flex-row gap-4 min-h-dvh w-full">
      {/* 필터 사이드바 */}
      {showFilter && (
        <FilterSidebar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filter={filter}
          onFilterChange={setFilter}
          jobs={jobs}
          departments={departments}
        />
      )}

      {/* 메인 콘텐츠 */}
      <div className="flex-col gap-40 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mobile:gap-20 w-full">
          {items.map((item, i) =>
            item.type === 'banner' ? (
              <div key={`banner-${i}`} className="col-span-full relative w-full h-auto">
                <Image
                  src={item.src}
                  alt="과 배너"
                  width={1200}
                  height={300}
                  className="w-full h-auto object-contain"
                  {...(items.findIndex((it) => it.type === 'banner') === i ? { priority: true } : {})}
                />
              </div>
            ) : (
              <PortfolioSheet key={item.data.profile.profile_name || i} data={item.data} />
            ),
          )}
        </div>
      </div>
    </div>
  );
}

