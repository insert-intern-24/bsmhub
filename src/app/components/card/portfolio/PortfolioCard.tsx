import React from 'react';
import { PortfolioCardProps } from './types';
import ProfileInfo from './components/ProfileInfo';
import StatusBadge from './components/StatusBadge';
import ProjectImages from './components/ProjectImages';
import ProfileImage from './components/ProfileImage';

const PortfolioCard = ({ profile, projects }: PortfolioCardProps) => {
  return (
    <div className="@container w-full h-fit rounded border-light-gray-outline bg-white p-4">
      {/* 컨테이너가 412px 미만일 때: 세로 레이아웃 (기존 PortfolioCard) */}
      <div
        className="@[412px]:hidden w-full h-fit flex-col flex-center"
        style={{
          background:
            'linear-gradient(180deg, #f9f9fb 26%, #fff 67.5%, #fff 100%)',
        }}
      >
        {/* Project Images Header */}
        <ProjectImages projects={projects} variant="default" />

        {/* Profile Section */}
        <div className="relative ml-2 w-full">
          <ProfileImage
            src={profile.profile_image}
            name={profile.name}
            size="small"
          />
          <ProfileInfo profile={profile} layout="horizontal" />
          <StatusBadge
            status={profile.status}
            className="absolute top-0 right-0"
          />
        </div>
      </div>

      {/* 컨테이너가 412px 이상일 때: 가로 레이아웃 (기존 LongPortfolioCard) */}
      <div className="hidden @[412px]:flex w-full h-fit gap-2.5">
        {/* Profile Image */}
        <ProfileImage
          src={profile.profile_image}
          name={profile.name}
          size="small"
        />

        <div className="flex-col gap-2 flex-1">
          {/* Profile Info */}
          <div className="relative w-full">
            <ProfileInfo profile={profile} layout="horizontal" />
            <StatusBadge
              status={profile.status}
              className="absolute top-0 right-0"
            />
          </div>

          {/* Project Images */}
          <ProjectImages projects={projects} variant="long" />
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;
