import Image from 'next/image';
import { Body, TitleEN } from '../components/system/text';

import { PortfolioProps } from '@/types/portfolio';
import Tabs from '../components/layout/Tabs';

import PortfolioHome from '../components/card/portfolio/PortfolioHome';
import { portfolioItemDatas } from '../mock/portfolio';
import PortfolioProject from '../components/card/portfolio/components/PortfolioProject';
import { mockPortfolioProjects } from '../mock/portfolioProject';

const Portfolio = ({ params, searchParams }: PortfolioProps) => {
  const uuid = params.uuid;
  const path = searchParams.path ?? 'home';
  const isHome = path === 'home';

  let Content, containerCss;

  if (isHome) {
    Content = (
      <PortfolioHome
        content="저는 주로 웹 애플리케이션 개발에 관심을 가지고 개발을 진행하고 있으며,
          최근에는 클라우드 네이티브 아키텍처에 대해 탐구하고 있습니다.

          특히, 마이크로서비스 패턴과 컨테이너 오케스트레이션에 주목하고 있으며,
          이를 통해 확장 가능하고 유지보수가 용이한 시스템 구축을 이루고자
          합니다.
          
          이를 위해 React, Node.js, Docker, Kubernetes를 활용하여, 보다
          효율적이고 안정적인 SaaS 플랫폼을 개발하고자 합니다.

          이 과정에서 성능 최적화와 사용자 경험 개선에 집중하고 있으며,
          결과적으로 비즈니스 가치 창출과 개발 생산성 향상을 목표로 삼고
          있습니다."
        items={portfolioItemDatas}
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
      <TitleEN className="mobile:mb-2">JUNHO LEE{uuid}</TitleEN>
      <div className={`${containerCss} responsive-portfolioHome`}>
        <Body className="text-gray-base flex-col justify-end">
          2학년 2반 이준호 | 소프트웨어개발과 백엔드 트랙
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
