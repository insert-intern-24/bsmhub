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

  // profileName이 있을 때와 없을 때를 구분하여 key를 설정
  const key = profileName && typeof profileName === 'string' ? `profile-${profileName}` : 'all-projects';

  return (
    <div className="container mx-auto pt-8">
      <CollectClient key={key} initialProjects={projects} type="project" />
    </div>
  );
}
