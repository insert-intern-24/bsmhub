import React from 'react';
import PortfolioHeader from './PortfolioHeader';
import PortfolioProfile from './PortfolioProfile';

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

const PortfolioCard = ({ profile, projects }: PortfolioCardProps) => {
  return (
    <div
      className="flex justify-center items-center w-fit h-fit rounded border-light-gray-outline"
      style={{
        background:
          'linear-gradient(180deg, #f9f9fb 26%, #fff 67.5%, #fff 100%)',
      }}
    >
      <div className="w-[20.3125rem] h-[11.625rem] flex flex-col justify-between items-center m-[0.625rem] mb-[1.375rem]">
        <PortfolioHeader projects={projects} />
        <PortfolioProfile profile={profile} />
      </div>
    </div>
  );
};

export default PortfolioCard;
