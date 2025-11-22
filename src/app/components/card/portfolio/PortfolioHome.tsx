import { Title } from '../../ui/text/text';

import { CardProps } from '@/app/components/card/project/ProjectCard';
import ProjectGrid from '@/app/components/feature/project/components/ProjectGrid';

interface PortfolioHomeProps {
  content: string;
  projects: CardProps[];
  profile_name: string;
}

const PortfolioHome = ({ content, projects }: PortfolioHomeProps) => {
  return (
    <section className="flex-col gap-5 min-h-[calc(100vh-10rem)] mobile:min-h-0">
      <div>{content}</div>
      <div>
        <Title>개인 프로젝트</Title>
        <ProjectGrid projects={projects} className="mt-2 portfolioHomeCard" />
      </div>
    </section>
  );
};

export default PortfolioHome;
