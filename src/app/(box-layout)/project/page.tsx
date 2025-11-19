import React from 'react';
import CollectionClient from '@/app/components/shared/CollectionClient';
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
      <CollectionClient initialProjects={projects} type="project" />
    </div>
  );
}
