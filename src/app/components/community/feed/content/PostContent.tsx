import React from 'react';
import Image from 'next/image';
import ProfileSanddeot from '@public/images/icon/ProfileSanddeot.png';
import Sanddeot from '@public/images/icon/Sanddeot.svg';

export default function PostContent() {
  return (
    <>
      <div className="flex p-4 flex-col justify-center items-start gap-4 self-stretch rounded-lg bg-customGray">
        <div className="flex items-center gap-[0.375rem]">
          <Image
            src={ProfileSanddeot}
            alt="ProfileSanddeot"
            width={(24 / 16) * 12}
            height={(24 / 16) * 12}
          />
          <span className="text-black font-pretendard text-base font-bold leading-none">
            산뜻
          </span>
          <span className="text-descriptionColor font-pretendard text-base font-normal leading-none">
            정보의 바다 속에 산뜻함을 더하다
          </span>
        </div>
        <div className="flex items-start gap-4">
          <Image
            src={Sanddeot}
            alt="Sanddeot"
            width={(416 / 16) * 12}
            height={(234 / 16) * 12}
          />
          <Image
            src={Sanddeot}
            alt="Sanddeot"
            width={(416 / 16) * 12}
            height={(234 / 16) * 12}
          />
        </div>
      </div>
    </>
  );
}
