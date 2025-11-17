'use server';

import { Fragment } from 'react';

import ProjectCard from '../../project/ProjectCard';
import { Title } from '@/app/components/system/text';

import type { CardProps } from '../../project/ProjectCard';

export interface PortfolioProjectType {
  mode: 'personal' | 'cooperation';
  datas: CardProps[];
}

export interface PortfolioProjectProps {
  personalProjects: CardProps[];
  cooperationProjects: CardProps[];
}

const mapProjectMode: Record<PortfolioProjectType['mode'], string> = {
  personal: '개인 프로젝트',
  cooperation: '협업 프로젝트',
};

const PortfolioProject = ({
  personalProjects,
  cooperationProjects,
}: PortfolioProjectProps) => {
  const projects: PortfolioProjectType[] = [
    {
      mode: 'personal',
      datas: personalProjects,
    },
    {
      mode: 'cooperation',
      datas: cooperationProjects,
    },
  ];

  return (
    <div className="grid gap-6 grid-cols-auto-fit-card -mt-8">
      {projects.map(({ mode, datas }) => (
        <Fragment key={mode}>
          <Title className="col-span-full mt-8">{mapProjectMode[mode]}</Title>
          {datas.map((data) => (
            <ProjectCard
              key={data.id}
              id={data.id}
              title={data.title}
              description={data.description}
              projectImage={data.projectImage}
              ownerName={data.ownerName}
              ownerProfileImage={data.ownerProfileImage}
              isTeam={data.isTeam}
              authors={data.authors}
            />
          ))}
        </Fragment>
      ))}
    </div>
  );
};

export default PortfolioProject;
