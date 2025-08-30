import React from 'react';
import Image from 'next/image';
import { Body2, Caption } from '../../system/text';

interface Profile {
  name: string;
  role: string;
  bio: string;
  status: string;
  profile_image: string;
}

interface PortfolioProfileProps {
  profile: Profile;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case '구직 중':
      return 'bg-[#F1FFF0] text-[#0B8800]';
    default:
      return 'bg-[#F1FFF0] text-[#0B8800]';
  }
};

const PortfolioProfile = ({ profile }: PortfolioProfileProps) => {
  return (
    <div className="relative ml-2 w-full">
      <Image
        src={profile.profile_image}
        alt={`${profile.name} 프로필`}
        width={(60 * 12) / 16}
        height={(60 * 12) / 16}
        className="rounded-full object-cover absolute top-[-4.25rem]"
      />
      <div className="flex flex-col gap-[0.375rem]">
        <Body2>{profile.name}</Body2>
        <Caption className="text-gray-base">{profile.role}</Caption>
        <Caption className="text-gray-base">{profile.bio}</Caption>
      </div>
      <div
        className={`absolute top-[-0.375rem] right-0 px-3 py-1 rounded-3xl ${getStatusColor(
          profile.status,
        )}`}
      >
        <Caption>{profile.status}</Caption>
      </div>
    </div>
  );
};

export default PortfolioProfile;
