import { Body, TitleEN } from '@/app/components/system/text';
import Tabs from '@/app/components/layout/Tabs';

import PortfolioHome from '@/app/components/card/portfolio/PortfolioHome';
import PortfolioProject from '@/app/components/card/portfolio/components/PortfolioProject';
import { getProfileDetail } from '@/services/profile/getProfileDetail.server';
import { getPersonalProjects } from '@/services/project/getPersonalProjects.server';
import { notFound } from 'next/navigation';
import { getCooperationProjects } from '@/services/project/getCooperationProjects.server';
import { convertStudentNumber } from '@/utils/convertStudentNumber';
import { getProfile } from '@/services/profile/getProfile.server';
import ProfileIcon from '@/app/components/card/portfolio/ProfileIcon';

interface PortfolioProps {
  profileName: string;
  path: 'home' | 'project';
}

const Portfolio = async ({ profileName, path = 'home' }: PortfolioProps) => {
  const profile = (await getProfile(profileName)) ?? notFound();
  const uuid = profile.profile_id;
  const studentInfo = profile.student;

  const profileDetail = await getProfileDetail(profileName);
  const cooperationProjects = await getCooperationProjects(uuid);
  const personalProjects = await getPersonalProjects(uuid);

  const isHome = path === 'home';

  let Content, containerCss;

  // param이 home이라면 home에 대한 컴포넌트와 css를 반환
  if (isHome) {
    Content = (
      <PortfolioHome
        content={profile.description ?? ''}
        details={profileDetail}
        projects={personalProjects}
        ownerId={profile.owner ?? ''}
        profile_name={profile.profile_name}
      />
    );
    containerCss =
      'grid grid-cols-[22rem_1fr] grid-rows-[auto_auto] gap-x-8 gap-y-4 -mt-[0.375rem]';
  } else {
    Content = (
      <PortfolioProject
        personalProjects={personalProjects}
        cooperationProjects={cooperationProjects}
      />
    );
    containerCss = 'flex-col gap-6 mt-[0.375rem]';
  }

  return (
    <div className="pt-[4.5rem] w-full relative">
      <ProfileIcon image={profile.profile_image} />
      <TitleEN className="mobile:mb-2">{profile.profile_name}</TitleEN>
      <div className={`${containerCss} responsive-portfolioHome`}>
        <Body className="text-gray-base flex-col justify-end gap-4]">
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
