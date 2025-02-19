import React from 'react';
import TotalFilter from './TotalFilter';

export default function Total() {
  return (
    <>
      <div className="flex items-center gap-6 self-stretch flex-wrap justify-between bg-white">
        <span className="flex-1 text-black text-xl font-bold leading-[150%] tracking-normal">
          검색결과 <span className="text-[#0B50D0]">24</span>개
        </span>
        <TotalFilter />
      </div>
    </>
  );
}
