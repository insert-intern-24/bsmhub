import React, { useState } from 'react';
import Total from './total/Total';
import ProjectCard from './list/ProjectCard';
import Pagination from './pagination/Pagination';
import { Projects, Sort } from '@/app/models/projectSearch';

export default function TotalList({
  projects,
  setSort,
}: {
  projects: Projects;
  setSort: React.Dispatch<React.SetStateAction<Sort>>;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <>
      <div className="flex flex-col items-start gap-6 self-stretch">
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
