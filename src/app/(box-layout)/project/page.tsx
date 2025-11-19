import React from 'react';
import CollectClient from '@/app/components/collect/CollectClient';
import {
  getProjects,
  getProjectsByProfileName,
} from '@/services/project/getProjects.server';

type ProjectPageProps = {
  searchParams: Promise<{ profileName?: string }>;
};

export default async function ProjectPage({ searchParams }: ProjectPageProps) {
  const params = await searchParams;
  const profileName = params.profileName;

  // profileName이 있으면 해당 사용자의 프로젝트만, 없으면 전체 프로젝트 조회
  const projects = profileName
    ? await getProjectsByProfileName(profileName)
    : await getProjects();

  return (
    <div className="container mx-auto pt-8">
      <CollectClient
        key={profileName ?? 'all'}
        initialProjects={projects}
        type="project"
        profileName={profileName}
      />
    </div>
  );
}
