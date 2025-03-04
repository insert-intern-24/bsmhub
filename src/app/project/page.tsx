'use client';
import React, { useState } from 'react';
import Filter from '../components/project/filter/Filter';
import Pagination from '../components/project/pagination/Pagination';
import TotalList from '../components/project/totallist/TotalList';
import { Projects } from '../models/projectSearch';

export default function Page() {
  const [projects, setProjects] = useState<Projects>([]);
  return (
    <>
      <div className="inline-flex pt-10 pr-16 pb-7 pl-[1.875rem] flex-col justify-end items-start gap-[1.125rem] bg-white">
        <span className="text-black text-[1.75rem] font-bold leading-none">
          프로젝트 모아보기
        </span>
        <Filter setProjects={setProjects} />
        <TotalList projects={projects} />
        <Pagination />
      </div>
    </>
  );
}
