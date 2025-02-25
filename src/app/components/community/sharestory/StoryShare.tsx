import React from 'react';
import Image from 'next/image';
import profile from '@public/images/icon/profile.svg';
import InputStory from './InputStory';

export default function StoryShare() {
  return (
    <>
      <div className="flex p-[1.125rem] items-center gap-[0.625rem] self-stretch rounded-2xl bg-white">
        <Image src={profile} alt="profile" width={44} height={44} />
        <InputStory />
      </div>
    </>
  );
}
