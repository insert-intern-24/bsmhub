'use client';
import React, { useState } from 'react';
import Filter from '../components/project/filter/Filter';
import TotalList from '../components/project/totallist/TotalList';
import { Projects, Sort } from '../models/projectSearch';

export default function Page() {
  const [projects, setProjects] = useState<Projects>([]);
  const [sort, setSort] = useState<Sort>('Sort');
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <>
      <div className="flex justify-center items-center">
        <div className="max-w-[94.5rem] inline-flex pt-10 pr-16 pb-10 pl-16 flex-col gap-[1.125rem] bg-white bottom-0 mt-24">
          <span className="text-black text-[1.75rem] font-bold leading-none">
            프로젝트 모아보기
          </span>
          <Filter
            setProjects={setProjects}
            sort={sort}
            setCurrentPage={setCurrentPage}
          />
          <TotalList
            projects={projects}
            setSort={setSort}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </>
  );
}
