import { Body, TitleEN } from '@/app/components/ui/text/text';
import Tabs from '@/app/components/layout/tabs/Tabs';

import PortfolioHome from '@/app/components/card/portfolio/PortfolioHome';
import PortfolioProject from '@/app/components/ui/profile/portfolio/PortfolioProject';
import { getProfileDetail } from '@/services/profile/getProfileDetail.server';
import { getPersonalProjects } from '@/services/project/getPersonalProjects.server';
import { notFound } from 'next/navigation';
import { getCooperationProjects } from '@/services/project/getCooperationProjects.server';
import { convertStudentNumber } from '@/utils/convertStudentNumber';
import { getProfile } from '@/services/profile/getProfile.server';
import ProfileIcon from '@/app/components/ui/profile/ProfileIcon';

interface PortfolioProps {
  profileName: string;
  path: 'home' | 'project';
}

const Portfolio = async ({ profileName, path = 'home' }: PortfolioProps) => {
  const profile = (await getProfile(profileName)) ?? notFound();
  const uuid = profile.profile_id;
  const studentInfo = profile.student;

  // studentInfo가 없으면 notFound
  if (!studentInfo) {
    notFound();
  }

  const profileDetail = await getProfileDetail(profileName);
  const cooperationProjects = await getCooperationProjects(uuid);
  const personalProjects = await getPersonalProjects(uuid);

  const isHome = path === 'home';

  // 희망 직무 추출
  const desiredJobs =
    studentInfo.student_jobs?.map(({ job }) => job.job_name) || [];
  const desiredJobText =
    desiredJobs.length > 0 ? `${desiredJobs.join(', ')} 희망` : '희망직무 없음';

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
      <TitleEN className="mobile:mb-2">
        {convertStudentNumber(studentInfo.student_number)} {studentInfo.name}
      </TitleEN>
      <div className={`${containerCss} responsive-portfolioHome`}>
        <Body className="text-gray-base flex-col justify-end gap-4">
          {studentInfo.departments?.department_name || '학과 정보 없음'} | {desiredJobText}
        </Body>

        <div className="mobile:hidden">
          <Tabs tabs={['home', 'project']} />
        </div>

        {Content}
      </div>
    </div>
  );
};

export default Portfolio;
