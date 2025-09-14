import React from 'react';
import { Caption } from '../../system/text';
import { PortfolioCardProps } from './types';
import ProfileImage from './components/ProfileImage';
import ProfileInfo from './components/ProfileInfo';

const ShortPortfolioCard = ({ profile }: PortfolioCardProps) => {
  return (
  <div className="flex-col gap-[0.625rem] py-[1.375rem] px-[2rem] bg-white w-fit h-fit flex-y-center rounded-2xl">
      {/* Profile Image */}
      <ProfileImage
        src={profile.profile_image}
        name={profile.name}
        size="large"
      />

      {/* Profile Info */}
  <div className="flex-col flex-y-center">
        <ProfileInfo
          profile={profile}
          layout="vertical"
          showBio={false}
          useLabel={true}
        />
      </div>

      {/* Bio */}
      <Caption className="text-gray-base w-[7.125rem] truncate block text-center">
        {profile.bio}
      </Caption>
    </div>
  );
};

export default ShortPortfolioCard;
