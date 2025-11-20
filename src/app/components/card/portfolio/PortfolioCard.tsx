import React from 'react';
import Link from 'next/link';
import { PortfolioCardProps } from './types';
import ProfileInfo from '@/app/components/ui/profile/portfolio/ProfileInfo';
import StatusBadge from '@/app/components/ui/badge/StatusBadge';
import ProjectImages from '@/app/components/ui/profile/portfolio/ProjectImages';
import ProfileImage from '@/app/components/ui/profile/ProfileImage';

const PortfolioCard = ({ profile, projects, src, studentName }: PortfolioCardProps) => {
  // 팀이 아닌 경우 studentName을 사용, 없으면 profile.name 사용
  const displayName = studentName || profile.name;
  const content = (
    <div className="@container w-full h-fit rounded border border-light-gray-outline bg-white p-4"
       style={{
        background:
          'linear-gradient(180deg, #f9f9fb 26%, #fff 67.5%, #fff 100%)',
      }}>
      {/* 컨테이너가 450px 미만일 때: 세로 레이아웃 (기존 PortfolioCard) */}
      <div
        className="@[450px]:hidden w-full h-fit flex-col flex-center"

      >
        {/* Project Images Header */}
        <ProjectImages projects={projects} variant="default" />

        {/* Profile Section */}
        <div className="relative pl-2 -top-7 w-full">
          <ProfileImage
            src={profile.profile_image}
            name={displayName}
            size="small"
          />
          <ProfileInfo profile={{ ...profile, name: displayName }} layout="horizontal" />
          <StatusBadge
            status={profile.status}
            className="absolute top-12 right-0"
          />
        </div>
      </div>

      {/* 컨테이너가 450px 이상일 때: 가로 레이아웃 (기존 LongPortfolioCard) */}
      <div className="hidden @[450px]:flex w-full h-fit gap-2.5">
        {/* Profile Image */}
        <ProfileImage
          src={profile.profile_image}
          name={displayName}
          size="small"
        />

        <div className="flex-col gap-2 flex-1 w-[calc(100%-0.625rem-45px)]">
          {/* Profile Info */}
          <div className="flex-1 relative">
            <ProfileInfo profile={{ ...profile, name: displayName }} layout="horizontal" />
            <StatusBadge
              status={profile.status}
              className="absolute top-0 right-0"
            />
          </div>

          {/* Project Images */}
          {projects.length ? (
            <ProjectImages projects={projects} variant="long" />
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
