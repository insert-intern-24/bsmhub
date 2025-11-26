import { Title } from '../../ui/text/text';

import { CardProps } from '@/app/components/card/project/ProjectCard';
import ProjectGrid from '@/app/components/feature/project/components/ProjectGrid';

interface PortfolioHomeProps {
  projects: CardProps[];
  profile_name: string;
}

const PortfolioHome = ({ projects }: PortfolioHomeProps) => {
  return (
    <section className="flex-col gap-5 min-h-[calc(100vh-10rem)] mobile:min-h-0">
      <div>
        <Title>개인 프로젝트</Title>
        {projects.length === 0 && (
          <div className="mt-2 text-gray-base">아직 등록되지 않았습니다.</div>
        )}
        {projects.length > 0 && (
          <ProjectGrid projects={projects} className="mt-2 portfolioHomeCard" />
        )}
      </div>
    </section>
  );
};

export default PortfolioHome;
