import React from 'react';
import Image from 'next/image';
import LongPortfolioProfile from './LongPortfolioProfile';
import LongPortfolioHeader from './LongPortfolioHeader';

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

const LongPortfolioCard = ({ profile, projects }: PortfolioCardProps) => {
  return (
    <div className="flex justify-center items-center w-fit h-fit rounded bg-white">
      <div className="flex flex-col justify-between items-center m-[1rem] gap-1">
        <div className="flex gap-[0.625rem]">
          <div className="relative w-[3.75rem] h-[3.75rem]">
            <Image
              src={profile.profile_image}
              alt={`${profile.name} 프로필`}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-2">
            <LongPortfolioProfile profile={profile} />
            <LongPortfolioHeader projects={projects} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LongPortfolioCard;
