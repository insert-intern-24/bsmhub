import React from 'react';
import Filter from '../components/project/filter/Filter';
import Pagination from '../components/project/pagination/Pagination';

export default function page() {
  return (
    <>
      <div className="inline-flex pt-10 pr-16 pb-7 pl-[1.875rem] flex-col justify-end items-start gap-[1.125rem] bg-white">
        <span className="text-black text-[1.75rem] font-bold leading-none">
          프로젝트 모아보기
        </span>
        <Filter />
        <Pagination />
      </div>
    </>
  );
}
