import { Title } from '@/app/components/system/text';
import Card, { CardProps } from '../../project/ProjectCard';

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
    <div className="flex-col gap-8">
      {projects.map(({ mode, datas }) => (
        <div key={mode}>
          <Title>{mapProjectMode[mode]}</Title>
          <div className="mt-1 grid gap-6 grid-cols-auto-fit-card">
            {datas.map((data) => (
              <Card
                key={data.id}
                id={data.id}
                title={data.title}
                projectImage={data.projectImage}
                authors={data.authors}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PortfolioProject;
