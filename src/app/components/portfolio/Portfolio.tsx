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
import PortfolioVisitTracker from '@/app/components/card/portfolio/PortfolioVisitTracker';
import ProfileEditButton from '@/app/components/ui/profile/portfolio/ProfileEditButton';
import PortfolioItems from '@/app/components/ui/profile/portfolio/PortfolioDetail';
import ContentEditor from '@/app/components/feature/editor/ContentEditor';
import { checkProfileEditPermission } from '@/services/profile/checkProfileEditPermission.server';

interface PortfolioProps {
  profileName: string;
  path: 'home' | 'project';
}

const Portfolio = async ({ profileName, path = 'home' }: PortfolioProps) => {
  const profile = await getProfile(profileName);
  
  // 프로필이 없으면 404 페이지 표시
  if (!profile) {
    notFound();
  }
  
  const uuid = profile.profile_id;
  const studentInfo = profile.student;

  // studentInfo가 없으면 notFound
  if (!studentInfo) {
    notFound();
  }

  const profileDetail = await getProfileDetail(profileName);
  const cooperationProjects = await getCooperationProjects(uuid);
  const personalProjects = await getPersonalProjects(uuid);
  
  // Check edit permission
  const hasEditPermission = await checkProfileEditPermission(uuid);

  const isHome = path === 'home';

  // 희망 직무 추출
  const desiredJobs =
    studentInfo.student_jobs?.map(({ job }) => job.job_name) || [];
  const desiredJobText =
    desiredJobs.length > 0 ? `${desiredJobs.join(', ')} 희망` : '희망직무 없음';

  return (
    <div className="pt-[4.5rem] w-full relative">
      <PortfolioVisitTracker
        profile={profile}
        personalProjects={personalProjects}
        cooperationProjects={cooperationProjects}
      />
      <ProfileIcon image={profile.profile_image} />
      <TitleEN className="mobile:mb-2">
        {convertStudentNumber(studentInfo.student_number)} {studentInfo.name}
      </TitleEN>
      <div
        className={`grid grid-cols-[22rem_1fr] grid-rows-[auto_auto] gap-x-8 gap-y-4 -mt-[0.375rem] responsive-portfolioHome`}
      >
        <Body className="text-gray-base flex-col justify-end gap-4">
          {studentInfo.departments?.department_name || '학과 정보 없음'} |{' '}
          {desiredJobText}
        </Body>

        <div className="mobile:hidden">
          <Tabs tabs={['home', 'project']} />
        </div>

        <aside className="flex-col gap-6 sticky top-24 self-start w-[21.75rem] mobile:static mobile:w-full">
          {profile.description && <Body className="text-gray-base">{profile.description}</Body>}
          <ProfileEditButton ownerId={profile.owner ?? ''} />
          <PortfolioItems details={profileDetail} />
        </aside>

        <div className="flex-col gap-6">
          {/* HTML Description Section */}
          <ContentEditor
            contentType="profile"
            id={profile.profile_id}
            initialHtmlContent={profile.profile_html_description?.html_content}
            hasEditPermission={hasEditPermission}
          />

          {isHome ? (
            <PortfolioHome
              projects={personalProjects}
              profile_name={profile.profile_name}
            />
          ) : (
            <PortfolioProject
              personalProjects={personalProjects}
              cooperationProjects={cooperationProjects}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
