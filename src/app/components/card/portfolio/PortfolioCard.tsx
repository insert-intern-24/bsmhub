import React from 'react';
import Link from 'next/link';
import { PortfolioCardProps } from './types';
import ProfileInfo from './components/ProfileInfo';
import StatusBadge from '@/app/components/ui/badge/StatusBadge';
import ProjectImages from './components/ProjectImages';
import ProfileImage from './components/ProfileImage';

const PortfolioCard = ({ profile, projects, src }: PortfolioCardProps) => {
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
            name={profile.name}
            size="small"
          />
          <ProfileInfo profile={profile} layout="horizontal" />
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
          name={profile.name}
          size="small"
        />

        <div className="flex-col gap-2 flex-1 w-[calc(100%-0.625rem-45px)]">
          {/* Profile Info */}
          <div className="flex-1 relative">
            <ProfileInfo profile={profile} layout="horizontal" />
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
