'use server';
import { Title } from '@/app/components/system/text';
import Card, { CardProps } from '../../project/ProjectCard';
import { Fragment } from 'react';

export interface PortfolioProjectType {
  mode: 'personal' | 'cooperation';
  datas: CardProps[];
}

export interface PortfolioProjectProps {
  projects: PortfolioProjectType[];
}

const mapProjectMode: Record<PortfolioProjectType['mode'], string> = {
  personal: '개인 프로젝트',
  cooperation: '협업 프로젝트',
};

const PortfolioProject = ({ projects }: PortfolioProjectProps) => {
  return (
    <div className="grid gap-6 grid-cols-auto-fit-card -mt-8">
      {projects.map(({ mode, datas }) => (
        <Fragment key={mode}>
          <Title className="col-span-full mt-8">{mapProjectMode[mode]}</Title>
          {datas.map((data) => (
            <Card
              key={data.id}
              id={data.id}
              title={data.title}
              projectImage={data.projectImage}
              authors={data.authors}
            />
          ))}
        </Fragment>
      ))}
    </div>
  );
};

export default PortfolioProject;
