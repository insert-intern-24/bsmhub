'use client';
import React, { useState } from 'react';
import Filter from '../components/project/filter/Filter';
import TotalList from '../components/project/totallist/TotalList';
import { Projects, Newest } from '../models/projectSearch';

export default function Page() {
  const [projects, setProjects] = useState<Projects>([]);
  const [sort, setSort] = useState<Newest>('newest');
  return (
    <>
      <div className="inline-flex pt-10 pr-16 pb-7 pl-[1.875rem] flex-col justify-end items-start gap-[1.125rem] bg-white">
        <span className="text-black text-[1.75rem] font-bold leading-none">
          프로젝트 모아보기
        </span>
        <Filter setProjects={setProjects} sort={sort} />
        <TotalList projects={projects} setSort={setSort} />
      </div>
    </>
  );
}
