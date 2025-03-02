import React, { Suspense } from 'react';
import Image from 'next/image';
import UserTabs from '@/app/components/section/userTabs/UserTabsServer';
import UserTabsClient from '@/app/components/section/userTabs/UserTabsClient';
import getProfileById from '@/services/profile/getProfileById';
import getProject from '@/services/project/getProject';

import { profileType } from '../models/profile';
import { categoryType, projectType } from '../models/project';
import { Details } from '../models/collection';
import getCategories from '@/services/project/getCategories';
import getProfileMarkdown from '@/services/profile/getProfileMarkdown';
import getDetails from '@/services/profile/getDetails';
import getProfileBySession from '@/services/profile/getProfileBySession';
import Button from './Button';

const UserTemplate = async ({ uuid }: { uuid: string }) => {
  const profile = (await getProfileById(uuid)) as profileType;
  const myProfile = await getProfileBySession();

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
              {myProfile?.profile_id && profile?.profile_id && (
                <Button
                  text="Pick"
                  senderId={myProfile.profile_id}
                  receiverId={profile.profile_id}
                />
              )}
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

export default UserTemplate;
