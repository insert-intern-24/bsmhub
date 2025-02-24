import React from 'react';
import Image from 'next/image';
import profile from '@public/images/profile/default.svg';

function ChatProfile() {
  return (
    <div className="flex items-center gap-3">
      <Image
        src={profile}
        width={(60 * 12) / 16}
        height={(60 * 12) / 16}
        alt="프로필 사진"
        className="rounded-full"
      />
      <div>
        <p className="text-[1rem] text-titleColor font-semibold leading-5">
          Martin Randolph
        </p>
        <p className="text-detailColor text-[0.875rem]">
          You: What’s man! · 9:40 AM
        </p>
      </div>
    </div>
  );
}

export default ChatProfile;
