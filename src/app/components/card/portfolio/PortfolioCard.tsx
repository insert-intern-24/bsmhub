import React from 'react';
import Image from 'next/image';
import { PortfolioCardProps } from './types';
import ProfileInfo from './components/ProfileInfo';
import StatusBadge from './components/StatusBadge';
import ProjectImages from './components/ProjectImages';
import ProfileImage from './components/ProfileImage';

const PortfolioCard = ({ profile, projects }: PortfolioCardProps) => {
  return (
    <div className="@container w-full h-fit">
      <div
        className="flex-center w-full h-fit rounded border-light-gray-outline"
        style={{
          background:
            'linear-gradient(180deg, #f9f9fb 26%, #fff 67.5%, #fff 100%)',
        }}
      >
        {/* 컨테이너가 300px 미만일 때: 세로 레이아웃 (기존 PortfolioCard) */}
        <div className="@[300px]:hidden w-full h-fit flex-col flex-center m-[0.865rem] mb-[1rem]">
          {/* Project Images Header */}
          <ProjectImages projects={projects} variant="default" />

          {/* Profile Section */}
          <div className="relative ml-2 w-full">
            <Image
              src={profile.profile_image}
              alt={`${profile.name} 프로필`}
              width={(60 * 12) / 16}
              height={(60 * 12) / 16}
              className="rounded-full object-cover absolute top-[-4.25rem]"
            />
            <ProfileInfo profile={profile} layout="horizontal" />
            <StatusBadge
              status={profile.status}
              className="absolute top-[-0.375rem] right-0"
            />
          </div>
        </div>

        {/* 컨테이너가 300px 이상일 때: 가로 레이아웃 (기존 LongPortfolioCard) */}
        <div className="hidden @[300px]:flex @[300px]:w-full @[300px]:h-fit @[300px]:m-[1rem] @[300px]:gap-1">
          {/* Profile Image */}
          <ProfileImage
            src={profile.profile_image}
            name={profile.name}
            size="small"
          />

          <div className="flex-col gap-2 w-full">
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
    </div>
  );
};

export default PortfolioCard;
