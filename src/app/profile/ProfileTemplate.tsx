import React, { Suspense } from 'react';
import Image from 'next/image';
import UserTabs from '@/app/components/profile/user/userTabs/UserTabsServer';
import UserTabsClient from '@/app/components/profile/user/userTabs/UserTabsClient';
import getProfileById from '@/services/profile/getProfileById';
import getProject from '@/services/project/getProject';
import { profileType } from '../models/profile';
import { categoryType, projectType } from '../models/project';
import { Details } from '../models/collection';
import getCategories from '@/services/project/getCategories';
import getProfileMarkdown from '@/services/profile/getProfileMarkdown';
import getDetails from '@/services/profile/getDetails';

const ProfileTemplate = async ({ uuid }: { uuid: string }) => {
  const profile = (await getProfileById(uuid)) as profileType;

  let projects: projectType[] = [];
  let categories: categoryType[] = [];
  let markdown: string | null = null;
  let details: Details | null = null;

  // profile id 있는지 확인 후 user 인지 유효성 검사
  if (!profile?.isTeam && profile?.profile_id) {
    const fetchedProjects = await getProject(profile.profile_id as string);

    projects = fetchedProjects.map((item) => item.projects);
    categories = (await getCategories(projects)).map(
      (item) => item.project_category,
    );
    markdown = await getProfileMarkdown(profile.profile_id);
    details = await getDetails(profile.profile_id);
  }

  // props 로 쉽게 넘기기 위해 userData 객체로 모았음
  const userData = {
    profile,
    projects,
    categories,
    markdown,
    details,
  };

  return (
    <>
      {/* 유저에 대한 코드 */}
      {!profile?.isTeam ? (
        <>
          <section>
            <Image
              src="/images/profile/default.svg"
              alt="default-profile"
              width={90}
              height={90}
            />
            <div className="flex justify-between items-center mt-3">
              <div>
                <p className="text-2xl font-threat text-titleColor">
                  {profile?.profile_name}
                </p>
                <p className="text-detailColor text-base">1학년 2반 이준호</p>
              </div>
              <button className="w-[13.75rem] flex gap-1 items-center justify-center bg-black px-5 py-2 rounded-3xl">
                <Image
                  src="/images/symbol/pick-plus.svg"
                  alt="pick"
                  width={14}
                  height={14}
                />
                <span className="font-bold text-white">Pick</span>
              </button>
            </div>
          </section>
          {/* 홈/프로젝트/게시물에 대한 section */}
          <Suspense fallback={<UserTabs userData={userData} />}>
            <UserTabsClient userData={userData} />
          </Suspense>
        </>
      ) : (
        <>{/* 팀에 대한 코드 */}</>
      )}
    </>
  );
};

export default ProfileTemplate;
