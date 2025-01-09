import React from 'react';

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
        <img
          src={profileImage}
          alt="UserProfile"
          width={`${44 / 16}rem`}
          height={`${44 / 16}rem`}
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
