import React from 'react';
import { Sort } from '@/app/models/projectSearch';

export default function TotalFilter({
  setSort,
}: {
  setSort: React.Dispatch<React.SetStateAction<Sort>>;
}) {
  const handleSortChange = () => {
    setSort('Sort');
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-center gap-3 bg-white">
        <div className="flex items-center gap-3 bg-white">
          <span className="text-black text-base font-bold leading-[150%] tracking-normal">
            정렬기준
          </span>
          <div className="flex items-center gap-2 rounded-xl bg-white">
            <span
              className="flex px-1 items-center gap-[0.5rem] rounded cursor-pointer"
              onClick={handleSortChange}
            >
              최신순
            </span>
            <span className="hidden px-1 items-center gap-[0.5rem] rounded ">
              인기순
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
