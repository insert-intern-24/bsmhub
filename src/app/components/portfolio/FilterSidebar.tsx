'use client';

import Inputs from '@/app/components/ui/input/SingleInput';
import Checkbox from '@/app/components/ui/input/Checkbox';
import { Body } from '@/app/components/ui/text/text';
import { Tables } from '@/services/supabase/database.types';

export interface FilterState {
  jobs: string[];
  departments: string[];
  showOnlyJobSeeking: boolean;
  showOnlyEmployed: boolean;
}

interface FilterSidebarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filter: FilterState;
  onFilterChange: (filter: FilterState) => void;
  jobs: Tables<'jobs'>[];
  departments: string[];
}

export default function FilterSidebar({
  searchTerm,
  onSearchChange,
  filter,
  onFilterChange,
  jobs,
  departments,
}: FilterSidebarProps) {
  const handleJobFilter = (jobName: string, checked: boolean) => {
    onFilterChange({
      ...filter,
      jobs: checked
        ? [...filter.jobs, jobName]
        : filter.jobs.filter((name) => name !== jobName),
    });
  };

  const handleDepartmentFilter = (departmentName: string, checked: boolean) => {
    onFilterChange({
      ...filter,
      departments: checked
        ? [...filter.departments, departmentName]
        : filter.departments.filter((name) => name !== departmentName),
    });
  };

  const handleEmploymentFilter = (
    filterType: 'jobSeeking' | 'employed',
    checked: boolean,
  ) => {
    onFilterChange({
      ...filter,
      [filterType === 'jobSeeking' ? 'showOnlyJobSeeking' : 'showOnlyEmployed']:
        checked,
    });
  };

  return (
    <aside className="flex-col gap-3 min-w-[25rem]">
      <Inputs
        icon="search"
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search"
        value={searchTerm}
      />

      <div className="flex-col gap-3 p-2">
        {/* 학과 필터 */}
        <Body>학과</Body>
        <div className="flex-col gap-1">
          {departments.map((dept) => (
            <Checkbox
              label={dept}
              key={dept}
              checked={filter.departments.includes(dept)}
              onChange={(checked) => handleDepartmentFilter(dept, checked)}
            />
          ))}
        </div>

        {/* 직무분야 필터 */}
        <Body>직무분야</Body>
        <div className="flex-col gap-1">
          {jobs.map((job) => (
            <Checkbox
              label={job.job_name}
              key={job.job_id}
              checked={filter.jobs.includes(job.job_name)}
              onChange={(checked) => handleJobFilter(job.job_name, checked)}
            />
          ))}
        </div>

        {/* 옵션 필터 */}
        <Body>옵션</Body>
        <div className="flex-col gap-1">
          <Checkbox
            label="구직 중만 표시"
            checked={filter.showOnlyJobSeeking}
            onChange={(checked) =>
              handleEmploymentFilter('jobSeeking', checked)
            }
          />
          <Checkbox
            label="취직 중만 표시"
            checked={filter.showOnlyEmployed}
            onChange={(checked) =>
              handleEmploymentFilter('employed', checked)
            }
          />
        </div>
      </div>
    </aside>
  );
}

