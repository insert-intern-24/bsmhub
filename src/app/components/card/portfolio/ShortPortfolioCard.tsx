import React from 'react';
import { Caption } from '../../system/text';
import { PortfolioCardProps } from './types';
import ProfileImage from './components/ProfileImage';
import ProfileInfo from './components/ProfileInfo';

const ShortPortfolioCard = ({ profile }: PortfolioCardProps) => {
  return (
    <div className="flex gap-[0.75rem] flex-col py-[1.375rem] px-[2rem] bg-white w-fit h-fit items-center rounded-2xl">
      {/* Profile Image */}
      <ProfileImage src={profile.profile_image} name={profile.name} size="large" />

      {/* Profile Info */}
      <div className="flex flex-col items-center">
        <ProfileInfo profile={profile} layout="vertical" showBio={false} useLabel={true} />
      </div>

      {/* Bio */}
      <Caption className="text-gray-base w-[7.125rem] truncate block text-center">
        {profile.bio}
      </Caption>
    </div>
  );
};

export default ShortPortfolioCard;