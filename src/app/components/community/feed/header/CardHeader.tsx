import React from 'react';
import Image from 'next/image';
import TeamProfile from '@public/images/icon/TeamProfile.svg';

interface CardHeaderProps {
  profileName: string;
  projectStatus: string;
  time: string;
}

export default function CardHeader({
  profileName,
  projectStatus,
  time,
}: CardHeaderProps) {
  return (
    <>
      <div className="flex items-center gap-2 self-stretch">
        <Image
          src={TeamProfile}
          alt="TeamProfile"
          width={(44 / 16) * 12}
          height={(44 / 16) * 12}
        />
        <div className="flex flex-col justify-center items-start">
          <div className="flex items-center">
            <span className="text-black  text-sm font-bold leading-none">
              {profileName}
            </span>
            <span className="text-descriptionColor  text-sm font-normal leading-none">
              {projectStatus}
            </span>
          </div>
          <span className="text-descriptionColor  text-xs font-normal leading-none">
            {time}
          </span>
        </div>
      </div>
    </>
  );
}
