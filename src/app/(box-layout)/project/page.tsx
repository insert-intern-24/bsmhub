import React from 'react';
import CollectClient from '@/app/components/collect/CollectClient';
import { getProjects } from '@/services/server/project/getProjects';

export default async function ProjectPage() {
  const projects = await getProjects();

  return (
    <div className="container mx-auto pt-8">
      <CollectClient initialProjects={projects} type="project" />
    </div>
  );
}
