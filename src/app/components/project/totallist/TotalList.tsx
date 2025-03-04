import React from 'react';
import Total from './total/Total';
import ProjectCard from './list/ProjectCard';
import { Projects } from '@/app/models/projectSearch';

export default function TotalList({ projects }: { projects: Projects }) {
  return (
    <>
      <div className="flex flex-col items-start gap-6 self-stretch">
        <Total />
        <ProjectCard projects={projects} />
      </div>
    </>
  );
}
