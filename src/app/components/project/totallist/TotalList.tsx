import React from 'react';
import Total from './total/Total';
import ProjectCard from './list/ProjectCard';
import Pagination from './pagination/Pagination';
import { Projects, Sort } from '@/app/models/projectSearch';

export default function TotalList({
  projects,
  setSort,
  currentPage,
  setCurrentPage,
}: {
  projects: Projects;
  setSort: React.Dispatch<React.SetStateAction<Sort>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <>
      <div className="flex flex-col items-start gap-6 self-stretch min-w-[83rem]">
        <Total projects={projects} setSort={setSort} />
        <ProjectCard
          projects={projects.slice((currentPage - 1) * 12, currentPage * 12)}
        />
        <Pagination
          projects={projects}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </>
  );
}
