'use client';
import React, { useState } from 'react';
import Filter from '../components/project/filter/Filter';
import TotalList from '../components/project/totallist/TotalList';
import { Searchable, Sort } from '../models/setSearch';

export default function Page() {
  const [profiles, setProfiles] = useState<Searchable[]>([]);
  const [sort, setSort] = useState<Sort>('Sort');
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <>
      <div className="flex justify-center items-center">
        <div className="container mx-auto pt-10 pb-16 px-[1.875rem] flex flex-col gap-[1.125rem] bg-white mt-24 md:max-w-[94.5rem] md:pr-16 md:pl-16 md:gap-[1.125rem]">
          <span className="text-black text-[1.75rem] font-bold leading-none">
            팀 모아보기
          </span>
          <Filter
            setSearch={setProfiles}
            sort={sort}
            setCurrentPage={setCurrentPage}
            type="team"
          />
          <TotalList
            search={profiles}
            setSort={setSort}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            type="team"
          />
        </div>
      </div>
    </>
  );
}
