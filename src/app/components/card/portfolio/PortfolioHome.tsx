import PortfolioItems from './components/PortfolioDetail';
import { Title } from '../../system/text';

import mockCardData from '@/app/mock/projectCard';
import Card from '../project/ProjectCard';

import { PortfolioDetailProps } from '@/app/portfolio/types/portfolio';

interface PortfolioHomeProps {
  content: string;
  details: PortfolioDetailProps[];
}

const PortfolioHome = ({ content, details }: PortfolioHomeProps) => {
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
            {mockCardData.map((data) => (
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
      </section>
    </>
  );
};

export default PortfolioHome;
