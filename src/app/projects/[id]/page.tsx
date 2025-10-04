'use client';

import ProjectMainContent from './components/ProjectMainContent';
import ProjectSidebar from './components/ProjectSidebar';
import type { Project } from './components/types';
import projectsData from '@/data/dummy-projects.json';

type ProjectDetailPageProps = {
  params: { id: string };
};

const resolveProject = (id: string): Project => {
  const numericId = Number(id);
  const project = projectsData.find((candidate) => candidate.id === numericId);

  return project ?? projectsData[0];
};

const ProjectDetailPage = ({ params }: ProjectDetailPageProps) => {
  const project = resolveProject(params.id);

  return (
    <section className="max-w-outer mx-auto py-[4.5rem]">
      <div className="flex">
        <ProjectSidebar project={project} />
        <ProjectMainContent project={project} />
      </div>
    </section>
  );
};

export default ProjectDetailPage;
