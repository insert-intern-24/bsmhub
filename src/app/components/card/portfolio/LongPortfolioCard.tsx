import React from 'react';
import { PortfolioCardProps } from './types';
import ProfileImage from './components/ProfileImage';
import ProfileInfo from './components/ProfileInfo';
import StatusBadge from './components/StatusBadge';
import ProjectImages from './components/ProjectImages';

const LongPortfolioCard = ({ profile, projects }: PortfolioCardProps) => {
  return (
    <div className="flex justify-center items-center w-fit h-fit rounded bg-white">
      <div className="flex flex-col justify-between items-center m-[1rem] gap-1">
        <div className="flex gap-[0.625rem]">
          {/* Profile Image */}
          <ProfileImage src={profile.profile_image} name={profile.name} size="small" />

          <div className="flex flex-col gap-2">
            {/* Profile Info */}
            <div className="relative w-full">
              <ProfileInfo profile={profile} layout="horizontal" />
              <StatusBadge status={profile.status} className="absolute top-0 right-0" />
            </div>

            {/* Project Images */}
            <ProjectImages projects={projects} variant="long" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LongPortfolioCard;