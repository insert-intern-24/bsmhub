import React from 'react';
import CollectClient from '@/app/components/collect/CollectClient';
import { getProjects, getMyProjects } from '@/services/project/getProjects.server';
import getAccount from '@/services/auth/getAccount.server';

interface ProjectPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProjectPage({ searchParams }: ProjectPageProps) {
  const params = await searchParams;
  const isMine = params.mine === 'true';

  let projects = [];

  if (isMine) {
    const user = await getAccount();
    if (user?.id) {
      projects = await getMyProjects(user.id);
    }
  } else {
    projects = await getProjects();
  }

  return (
    <div className="container mx-auto pt-8">
      <CollectClient initialProjects={projects} type="project" />
    </div>
  );
}
