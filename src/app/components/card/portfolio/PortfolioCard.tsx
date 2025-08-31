import React from 'react';
import Image from 'next/image';
import { PortfolioCardProps } from './types';
import ProfileInfo from './components/ProfileInfo';
import StatusBadge from './components/StatusBadge';
import ProjectImages from './components/ProjectImages';

const PortfolioCard = ({ profile, projects }: PortfolioCardProps) => {
  return (
    <div
      className="flex justify-center items-center w-fit h-fit rounded border-light-gray-outline"
      style={{
        background: 'linear-gradient(180deg, #f9f9fb 26%, #fff 67.5%, #fff 100%)',
      }}
    >
      <div className="w-[20.3125rem] h-[11.625rem] flex flex-col justify-between items-center m-[0.625rem] mb-[1.375rem]">
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
          <ProfileInfo profile={profile} />
          <StatusBadge status={profile.status} className="absolute top-[-0.375rem] right-0" />
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;