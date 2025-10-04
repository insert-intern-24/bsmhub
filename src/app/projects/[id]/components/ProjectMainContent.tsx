'use client';

import { Body } from '@/app/components/system/text';
import type { Project } from './types';

type ProjectVideoProps = {
  url: string;
  title: string;
};

const ProjectVideo = ({ url, title }: ProjectVideoProps) => (
  <section className="flex-col mb-[0.875rem]">
    <div className="relative h-[34.375rem] w-full overflow-hidden">
      <iframe src={url} title={title} className="h-full w-full" allow="encrypted-media;" allowFullScreen />
    </div>
  </section>
);

const ProjectMainContent = ({ project }: { project: Project }) => (
  <main className="w-full px-[4.6875rem]">
    <ProjectVideo url={project.youtubeUrl} title={project.title} />
    <Body>{project.detailDescription}</Body>
  </main>
);

export default ProjectMainContent;
