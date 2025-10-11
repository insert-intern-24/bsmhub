import Image from 'next/image';
import { Body, TitleEN } from '../components/system/text';

import Tabs from '../components/layout/Tabs';

import PortfolioHome from '../components/card/portfolio/PortfolioHome';
import PortfolioProject, {
  PortfolioProjectType,
} from '../components/card/portfolio/components/PortfolioProject';
import { getProfileById } from '@/services/profile/getProfileById';
import { getProfileDetail } from '@/services/profile/getProfileDetail';
import { getProfileIntroduce } from '@/services/profile/getProfileIntroduce';
import { getPersonalProjects } from '@/services/project/getPersonalProjects';
import { notFound } from 'next/navigation';
import { getCooperationProjects } from '@/services/project/getCooperationProjects';
import { getStudentInfo } from '@/services/profile/getStudentInfo';
import { convertStudentNumber } from '@/utils/convertStudentNumber';
import { convertTofromDatabaseImageURL } from '@/utils/supabase/imageHostConverter';

interface PortfolioProps {
  uuid: string;
  path: 'home' | 'project';
}

const Portfolio = async ({ uuid, path = 'home' }: PortfolioProps) => {
  const profile = await getProfileById(uuid);
  if (!profile) notFound();

  const studentInfo = (await getStudentInfo(uuid)).student;
  const profileDetail = await getProfileDetail(uuid);
  const profileIntroduce = await getProfileIntroduce(uuid);
  const cooperationProjects = await getCooperationProjects(uuid);
  const personalProjects = (await getPersonalProjects(uuid)).map((project) => ({
    ...project,
    authors: [
      { profileImage: convertTofromDatabaseImageURL(profile.profile_image) },
    ],
  }));

  const portfolioProjects: PortfolioProjectType[] = [
    {
      mode: 'personal',
      datas: personalProjects,
    },
    {
      mode: 'cooperation',
      datas: cooperationProjects,
    },
  ];

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
    Content = <PortfolioProject projects={portfolioProjects} />;
    containerCss = 'flex-col gap-6 mt-5';
  }

  return (
    <div className="pt-[4.5rem] px-[2.75rem] relative">
      <Image
        width={(120 / 16) * 14}
        height={(120 / 16) * 14}
        alt="프로필 사진"
        src={convertTofromDatabaseImageURL(profile.profile_image)}
        className="rounded-sm absolute -top-20"
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
