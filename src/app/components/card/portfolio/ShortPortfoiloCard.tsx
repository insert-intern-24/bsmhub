import React from 'react';
import Image from 'next/image';
import { Body2, Caption, Label } from '../../system/text';

interface Project {
  title: string;
  logo: string;
  projectImage: string;
}

interface Profile {
  name: string;
  role: string;
  bio: string;
  status: string;
  profile_image: string;
}

interface PortfolioCardProps {
  profile: Profile;
  projects: Project[];
}

const ShortPortfolioCard = ({ profile }: PortfolioCardProps) => {
  return (
    <div className="flex gap-[0.75rem] flex-col py-[1.375rem] px-[2rem] bg-white w-fit h-fit items-center rounded-2xl">
      <div className="relative w-[6.25rem] h-[6.25rem]">
        <Image
          src={profile.profile_image}
          alt={`${profile.name} 프로필`}
          fill
          className="rounded-full object-cover"
        />
      </div>
      <div className="flex flex-col items-center">
        <Body2>{profile.name}</Body2>
        <Label className="text-gray-base">{profile.role}</Label>
      </div>
      <Caption className="text-gray-base w-[7.125rem] truncate">
        {profile.bio}
      </Caption>
    </div>
  );
};

export default ShortPortfolioCard;
