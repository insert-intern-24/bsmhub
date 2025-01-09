import React from 'react';
import Image from 'next/image';

interface CommentHeaderProps {
  name: string;
  time: string;
  profileImage: string;
}

export default function CommentHeader({
  name,
  time,
  profileImage,
}: CommentHeaderProps) {
  return (
    <>
      <div className="flex items-center gap-2 self-stretch">
        <Image
          src={profileImage}
          alt="UserProfile"
          width={(44 / 16) * 12}
          height={(44 / 16) * 12}
        />
        <div className="flex items-center gap-1">
          <span className="text-black font-pretendard text-base font-bold leading-none">
            {name}
          </span>
          <span className="text-descriptionColor font-pretendard text-xs font-normal leading-none">
            {time}
          </span>
        </div>
        <span className="text-followBlue font-pretendard text-sm font-normal leading-none">
          Follow
        </span>
      </div>
    </>
  );
}
