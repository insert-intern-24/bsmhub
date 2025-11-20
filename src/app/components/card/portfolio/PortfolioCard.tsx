import React from 'react';
import Link from 'next/link';
import { PortfolioCardProps } from './types';
import ProfileInfo from '@/app/components/ui/profile/portfolio/ProfileInfo';
import ProjectImages from '@/app/components/ui/profile/portfolio/ProjectImages';
import ProfileImage from '@/app/components/ui/profile/ProfileImage';

const PortfolioCard = ({
  profile,
  projects,
  src,
  studentName,
  maxProjects,
}: PortfolioCardProps) => {
  // 팀이 아닌 경우 studentName을 사용, 없으면 profile.name 사용
  const displayName = studentName || profile.name;
  const content = (
    <div
      className="@container w-full h-full rounded border border-light-gray-outline bg-white p-4"
      style={{
        background:
          'linear-gradient(180deg, #f9f9fb 26%, #fff 67.5%, #fff 100%)',
      }}
    >
      {/* 컨테이너가 450px 미만일 때: 세로 레이아웃 (기존 PortfolioCard) */}
      <div className="@[450px]:hidden w-full h-fit flex-col flex-center">
        {/* Project Images Header - 모바일은 최대 3개 */}
        <ProjectImages
          projects={projects}
          variant="default"
          maxProjects={maxProjects ?? 3}
        />

        {/* Profile Section */}
        <div className="relative pl-2 -top-7 w-full">
          <ProfileImage
            src={profile.profile_image}
            name={displayName}
            size="small"
          />
          <ProfileInfo
            profile={{ ...profile, name: displayName }}
            layout="horizontal"
          />
        </div>
      </div>

      {/* 컨테이너가 450px 이상일 때: 가로 레이아웃 (기존 LongPortfolioCard) */}
      <div className="hidden @[450px]:flex w-full h-fit gap-4">
        {/* Profile Image */}
        <ProfileImage
          src={profile.profile_image}
          name={displayName}
          size="small"
        />

        <div className="flex-col gap-4 w-full overflow-hidden">
          {/* Profile Info */}
          <ProfileInfo
            profile={{ ...profile, name: displayName }}
            layout="horizontal"
          />

          {/* Project Images - 데스크톱은 무제한 */}
          {projects.length ? (
            <ProjectImages
              projects={projects}
              variant="long"
              maxProjects={maxProjects}
            />
          ) : null}
        </div>
      </div>
    </div>
  );

  if (src) {
    return (
      <Link href={src} className="cursor-pointer">
        {content}
      </Link>
    );
  }

  return content;
};

export default PortfolioCard;
