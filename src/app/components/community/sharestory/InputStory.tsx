import React from 'react';
import Image from 'next/image';
import write from '@public/images/icon/write.svg';

export default function InputStory() {
  return (
    <>
      <div className="flex px-[0.625rem] py-[0.875rem] items-center gap-2 flex-1 rounded-lg bg-customGray">
        <Image src={write} alt="write" width={18} height={18} />
        <input
          type="text"
          placeholder="공유할 이야기가 있으신가요?"
          className="flex-1 bg-customGray text-descriptionColor font-pretendard text-base font-normal leading-none outline-none"
        />
      </div>
    </>
  );
}
