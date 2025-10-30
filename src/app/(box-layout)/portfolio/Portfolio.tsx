import { Body, TitleEN } from '@/app/components/system/text';
import Tabs from '@/app/components/layout/Tabs';

import PortfolioHome from '@/app/components/card/portfolio/PortfolioHome';
import PortfolioProject from '@/app/components/card/portfolio/components/PortfolioProject';
import { getProfileDetail } from '@/services/server/profile/getProfileDetail';
import { getPersonalProjects } from '@/services/server/project/getPersonalProjects';
import { notFound } from 'next/navigation';
import { getCooperationProjects } from '@/services/server/project/getCooperationProjects';
import { convertStudentNumber } from '@/utils/convertStudentNumber';
import { convertFromDatabaseImageURL } from '@/utils/supabase/imageHostConverter';
import { getProfile } from '@/services/server/profile/getProfile';
import ProfileIcon from '@/app/components/card/portfolio/ProfileIcon';
import getMyAccount from '@/services/server/auth/getMyAccount';
import ProfileEditButton from '@/app/components/card/portfolio/ProfileEditButton';

interface PortfolioProps {
  profileName: string;
  path: 'home' | 'project';
}

const Portfolio = async ({ profileName, path = 'home' }: PortfolioProps) => {
  const profile = (await getProfile(profileName)) ?? notFound();
  const uuid = profile.profile_id;
  const studentInfo = profile.student;
  const currentUser = await getMyAccount();

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
    <div className="pt-[4.5rem] w-full relative">
      <ProfileIcon image={profile.profile_image} />
      <TitleEN className="mobile:mb-2">{profile.profile_name}</TitleEN>
      <div className={`${containerCss} responsive-portfolioHome`}>
        <Body className="text-gray-base flex-col justify-end gap-4">
          {convertStudentNumber(studentInfo.student_number)} {studentInfo.name}{' '}
          | {studentInfo.departments.department_name}
          {currentUser.id == profile.owner && (
            <ProfileEditButton
              ownerId={profile.owner}
              profileName={profile.profile_name}
            />
          )}
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
