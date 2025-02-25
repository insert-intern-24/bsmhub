import React from 'react';
import Total from './total/Total';
import ProjectCard from './list/ProjectCard';

export default function TotalList() {
  return (
    <>
      <div className="flex flex-col items-start gap-6 self-stretch">
        <Total />
        <ProjectCard />
      </div>
    </>
  );
}
