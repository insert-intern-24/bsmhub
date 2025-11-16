import React from 'react';
import CollectClient from '@/app/components/collect/CollectClient';
import { getProjects, getProjectsByProfileName } from '@/services/project/getProjects.server';

interface ProjectPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProjectPage({ searchParams }: ProjectPageProps) {
  const params = await searchParams;
  const profileName = params.profileName;

  let projects = [];

  if (profileName && typeof profileName === 'string') {
    projects = await getProjectsByProfileName(profileName);
  } else {
    projects = await getProjects();
  }

  return (
    <div className="container mx-auto pt-8">
      <CollectClient initialProjects={projects} type="project" />
    </div>
  );
}
