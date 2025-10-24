import PortfolioItems from './components/PortfolioDetail';
import { Title } from '../../system/text';
import Card from '../project/ProjectCard';

import { PortfolioDetailProps } from '@/app/(box-layout)/portfolio/types';
import { CardProps } from '@/app/components/card/project/ProjectCard';

interface PortfolioHomeProps {
  content: string;
  details: PortfolioDetailProps[];
  projects: CardProps[];
}

const PortfolioHome = ({ content, details, projects }: PortfolioHomeProps) => {
  return (
    <>
      <aside>
        <PortfolioItems details={details} />
      </aside>
      <section className="flex-col gap-5">
        <div>{content}</div>
        <div>
          <Title>개인 프로젝트</Title>
          <div className="mt-2 grid gap-6 grid-cols-auto-fit-card portfolioHomeCard">
            {projects.map((data) => (
              <Card
                key={data.id}
                id={data.id}
                title={data.title}
                description={data.description}
                projectImage={data.projectImage}
                ownerName={data.ownerName}
                isTeam={data.isTeam}
                authors={data.authors}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default PortfolioHome;
