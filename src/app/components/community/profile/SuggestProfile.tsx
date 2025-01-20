import React from 'react';
import Image from 'next/image';
import timeline from '@public/images/icon/timeline.svg';
import Profile from '@/app/components/community/profile/Profile';

export default function SuggestProfile() {
  const profiles = Array(7).fill(null);

  return (
    <>
      <div className="w-full flex px-1 flex-col justify-center items-start gap-[0.625rem] self-stretch max-w-full overflow-auto scrollbar-none">
        <div className="flex items-center gap-[0.625rem]">
          <Image
            src={timeline}
            alt="timeline"
            width={(24 / 16) * 12}
            height={(24 / 16) * 12}
          />
          <span className="text-black font-pretendard text-base font-normal leading-none">
            Recommend Profiles
          </span>
        </div>
        <div className="flex items-start gap-2">
          {profiles.map((_, index) => (
            <Profile key={index} />
          ))}
        </div>
      </div>
    </>
  );
}
