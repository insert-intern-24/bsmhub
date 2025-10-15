import Image from 'next/image';
import { Body, TitleEN } from '../components/system/text';

import Tabs from '../components/layout/Tabs';

import PortfolioHome from '../components/card/portfolio/PortfolioHome';
import PortfolioProject from '../components/card/portfolio/components/PortfolioProject';
import { getProfileDetail } from '@/services/server/profile/getProfileDetail';
import { getPersonalProjects } from '@/services/server/project/getPersonalProjects';
import { notFound } from 'next/navigation';
import { getCooperationProjects } from '@/services/server/project/getCooperationProjects';
import { convertStudentNumber } from '@/utils/convertStudentNumber';
import { convertFromDatabaseImageURL } from '@/utils/supabase/imageHostConverter';
import { getProfile } from '@/services/server/profile/getProfile';

interface PortfolioProps {
  profileName: string;
  path: 'home' | 'project';
}

const Portfolio = async ({ profileName, path = 'home' }: PortfolioProps) => {
  const profile = (await getProfile(profileName)) ?? notFound();
  const uuid = profile.profile_id;
  const studentInfo = profile.profile_permission[0].student;

  const profileDetail = await getProfileDetail(profileName);
  const cooperationProjects = await getCooperationProjects(uuid);
  const personalProjects = (await getPersonalProjects(uuid)).map((project) => ({
    ...project,
    authors: [
      { profileImage: convertFromDatabaseImageURL(profile.profile_image) }, // getPersonalProjects 함수에서 Join으로 가져오지 않은 개인 프로필 이미지 추가
    ],
  }));

  const isHome = path === 'home';

  let Content, containerCss;

  // param이 home이라면 home에 대한 컴포넌트와 css를 반환
  if (isHome) {
    Content = (
      <PortfolioHome
        content={profile.description ?? ''}
        details={profileDetail}
        projects={personalProjects}
      />
    );
    containerCss = 'grid grid-cols-[22rem_1fr] grid-rows-[auto_auto] gap-7';
  } else {
    Content = (
      <PortfolioProject
        personalProjects={personalProjects}
        cooperationProjects={cooperationProjects}
      />
    );
    containerCss = 'flex-col gap-6 mt-5';
  }

  return (
    <div className="pt-[4.5rem] px-[2.75rem] relative">
      <Image
        width={(120 / 16) * 14}
        height={(120 / 16) * 14}
        alt="프로필 사진"
        src={convertFromDatabaseImageURL(profile.profile_image)}
        className="rounded-sm absolute -top-20"
        priority
      />
      <TitleEN className="mobile:mb-2">{profile.profile_name}</TitleEN>
      <div className={`${containerCss} responsive-portfolioHome`}>
        <Body className="text-gray-base flex-col justify-end">
          {convertStudentNumber(studentInfo.student_number)} {studentInfo.name}{' '}
          | {studentInfo.departments.department_name}
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
