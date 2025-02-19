'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import leftArrow from '@public/images/icon/left-arrow.svg';
import paginationStomic from '@public/images/icon/paginationAtomic.svg';
import RightArrow from '@public/images/icon/right-arrow.svg';

export default function Pagination() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <>
      <div className="flex items-center self-stretch justify-center">
        <div className="flex items-center gap-2 max-h-10">
          <div className="flex pt-0 pr-2 pb-0 pl-1 justify-center items-center rounded-md">
            <Image src={leftArrow} alt="leftArrow" width={18} height={18} />
            <span className="text-textDisabled text-center text-base font-normal leading-[150%] tracking-normal">
              이전
            </span>
          </div>
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className={`flex min-w-10 h-10 justify-center items-center rounded-md cursor-pointer  ${
                activeIndex === i ? 'bg-black' : 'bg-white'
              }`}
              onClick={() => handleClick(i)}
            >
              <span
                className={`text-center text-base font-bold leading-[150%] tracking-normal ${
                  activeIndex === i
                    ? 'text-white'
                    : 'text-[#464C53] font-normal'
                }`}
              >
                {i + 1}
              </span>
            </div>
          ))}
          <Image
            src={paginationStomic}
            alt="paginationStomic"
            width={40}
            height={40}
          />
          <div className="flex max-w-10 justify-center items-center bg-white">
            <span className="text-[#464C53] text-center text-base font-normal leading-[150%] tracking-normal">
              99
            </span>
          </div>
          <div className="flex pt-0 pr-2 pb-0 pl-1 justify-center items-center rounded-md">
            <span className="text-textDisabled text-center text-base font-normal leading-[150%] tracking-normal">
              이후
            </span>
            <Image src={RightArrow} alt="RightArrow" width={18} height={18} />
          </div>
        </div>
      </div>
    </>
  );
}
