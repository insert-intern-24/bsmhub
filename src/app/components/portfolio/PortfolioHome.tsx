import PortfolioDetailSection from '@/app/components/portfolio/section/PortfolioDetailSection';
import { Title } from '@/app/components/shared/system/text';

import { PortfolioDetailProps } from '@/app/components/portfolio/types';
import { CardProps } from '@/app/components/card/project/ProjectCard';
import ProfileEditButton from '@/app/components/shared/ProfileEditButton';
import ProjectGrid from '../project/components/ProjectGrid';

interface PortfolioHomeProps {
  content: string;
  details: PortfolioDetailProps[];
  projects: CardProps[];
  ownerId: string;
  profile_name: string;
}

const PortfolioHome = ({
  content,
  details,
  projects,
  ownerId,
}: PortfolioHomeProps) => {
  return (
    <>
      <aside className="flex-col gap-6 sticky top-24 self-start w-[21.75rem] mobile:static mobile:w-full">
        <ProfileEditButton ownerId={ownerId} />
        <PortfolioDetailSection details={details} />
      </aside>
      <section className="flex-col gap-5 min-h-[calc(100vh-10rem)] mobile:min-h-0">
        <div>{content}</div>
        <div>
          <Title>개인 프로젝트</Title>
          <ProjectGrid projects={projects} className="mt-2 portfolioHomeCard" />
        </div>
      </section>
    </>
  );
};

export default PortfolioHome;

