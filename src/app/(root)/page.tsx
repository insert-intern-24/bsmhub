'use client';

import ProjectList from '@/app/components/ProjectList';
import { getProjectsClient } from '@/services/client/projectService';
import GoogleOneTab from '@/app/components/auth/GoogleOneTab';
import { useEffect, useState } from 'react';
import { CardProps } from '@/app/components/card/project/ProjectCard';

export default function Home() {
  const [projects, setProjects] = useState<CardProps[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await getProjectsClient();
      setProjects(data);
    };
    fetchProjects();
  }, []);

  return (
    <div className="flex-col gap-4 w-full">
      <GoogleOneTab />
      <div className="flex-center">
        <div className="h-[14.75rem] w-full bg-gray-base"></div>
      </div>
      <ProjectList projects={projects} />
    </div>
  );
}
