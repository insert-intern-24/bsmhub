import React from 'react';
import { getProjects } from '@/services/server/project/getProjects';
import ProjectClient from './Project';

export default async function ProjectPage() {
  const initialProjects = await getProjects();

  return (
    <div className="container mx-auto pt-32">
      <ProjectClient initialProjects={initialProjects} />
    </div>
  );
}
