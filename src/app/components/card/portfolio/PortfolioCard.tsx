import React from 'react';
import { PortfolioCardProps } from './types';
import ProfileInfo from './components/ProfileInfo';
import StatusBadge from './components/StatusBadge';
import ProjectImages from './components/ProjectImages';
import ProfileImage from './components/ProfileImage';

const PortfolioCard = ({ profile, projects }: PortfolioCardProps) => {
  return (
    <div
      className="flex-x-center w-fit h-fit rounded border-light-gray-outline"
      style={{
        background:
          'linear-gradient(180deg, #f9f9fb 26%, #fff 67.5%, #fff 100%)',
      }}
    >
      <div className="w-[20.3125rem] h-[11.625rem] flex-col flex-center m-[0.865rem] mb-[1rem]">
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

      {/* 컨테이너가 450px 이상일 때: 가로 레이아웃 (기존 LongPortfolioCard) */}
      <div className="hidden @[450px]:flex w-full h-fit gap-2.5">
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
