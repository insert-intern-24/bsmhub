'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export type TabMode =
  | 'home'
  | 'project'
  | 'all'
  | 'official'
  | 'general'
  | 'Web'
  | 'Desktop Utility'
  | 'Mobile';

const mapTabValue: Record<TabMode, string> = {
  home: '홈',
  project: '프로젝트',
  all: '전체',
  official: '전공 동아리',
  general: '일반 동아리',
  Web: '웹',
  'Desktop Utility': '데스크톱',
  Mobile: '모바일',
};

interface TabsProps {
  tabs: TabMode[];
}

const Tabs = ({ tabs }: TabsProps) => {
  const searchParams = useSearchParams();
  const currentPath = (searchParams.get('path') ?? tabs[0]) as TabMode;

  return (
    <div className="flex border-b-[1px] border-[#F1F1F1] w-full">
      {tabs.map((mode) => {
        const isActive = currentPath === mode;

        return (
          <Link
            key={mode}
            className={`px-5 pb-2 border-b-2 ${
              isActive ? 'border-black' : 'border-transparent text-gray-base'
            }`}
            href={`?path=${mode}`}
          >
            {mapTabValue[mode]}
          </Link>
        );
      })}
    </div>
  );
};

export default Tabs;
