import React from 'react';
import TotalFilter from './TotalFilter';
import { Searchable, Sort } from '@/app/models/setSearch';

export default function Total({
  projects,
  setSort,
}: {
  projects: Searchable[];
  setSort: React.Dispatch<React.SetStateAction<Sort>>;
}) {
  return (
    <>
      <div className="flex flex-col md:flex-row items-center gap-6 w-full justify-between bg-white">
        <span className="flex-1 text-black text-xl font-bold leading-[150%] tracking-normal">
          검색결과 <span className="text-[#0B50D0]">{projects.length}</span>개
        </span>
        <TotalFilter setSort={setSort} />
      </div>
    </>
  );
}
