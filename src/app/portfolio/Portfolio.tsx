import Image from 'next/image';
import { Body, TitleEN } from '../components/system/text';

import Tabs from '../components/layout/Tabs';

import PortfolioHome from '../components/card/portfolio/PortfolioHome';
import PortfolioProject from '../components/card/portfolio/components/PortfolioProject';
import { getProfileById } from '@/services/profile/getProfileById';
// import NotFound from '../not-found';
import { convertName } from '@/utils/convertName';
import { getProfileDetail } from '@/services/profile/getProfileDetail';
import { getProfileIntroduce } from '@/services/profile/getProfileIntroduce';
import { getPersonalProjects } from '@/services/project/getPersonalProjects';
import { mockPortfolioProjects } from '../mock/portfolioProject';
import { notFound } from 'next/navigation';

interface PortfolioProps {
  uuid: string;
  path: 'home' | 'project';
}

const Portfolio = async ({ uuid, path = 'home' }: PortfolioProps) => {
  const profile = await getProfileById(uuid);
  if (!profile) notFound();

  const profileDetail = await getProfileDetail(uuid);
  const profileIntroduce = await getProfileIntroduce(uuid);
  const personalProjects = await getPersonalProjects(uuid);

  const isHome = path === 'home';

  let Content, containerCss;

  if (isHome) {
    Content = (
      <PortfolioHome
        content={profileIntroduce}
        details={profileDetail}
        projects={personalProjects}
      />
    );
    containerCss = 'grid grid-cols-[22rem_1fr] grid-rows-[auto_auto] gap-7';
  } else {
    Content = <PortfolioProject projects={mockPortfolioProjects} />;
    containerCss = 'flex-col gap-6 mt-5';
  }

  return (
    <div className="pt-[4.5rem] px-[2.75rem] relative">
      <Image
        width={(120 / 16) * 14}
        height={(120 / 16) * 14}
        alt="프로필 사진"
        src="/shared/profile.png"
        className="rounded-sm absolute -top-20"
      />
      <TitleEN className="mobile:mb-2">
        {convertName(profile.profile_name)}
      </TitleEN>
      <div className={`${containerCss} responsive-portfolioHome`}>
        <Body className="text-gray-base flex-col justify-end">
          2학년 2반 {profile.profile_name} | 소프트웨어개발과 백엔드 트랙
        </Body>

        <div className={`${isHome ? 'max-w-[46rem]' : ''} mobile:hidden`}>
          <Tabs tabs={['home', 'project']} />
        </div>

        {Content}
      </div>
    </div>
  );
};

export default Portfolio;
