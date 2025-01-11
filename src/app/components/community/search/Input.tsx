import React from 'react';
import Image from 'next/image';
import search from '@public/images/icon/search.svg';

export default function Input() {
  return (
    <>
      <div className="flex px-3 py-2 items-center gap-[0.625rem] flex-1 rounded-[0.6875rem] bg-customGray">
        <Image src={search} alt="search" width={18} height={18} />
        <input
          type="text"
          placeholder="검색"
          className="flex-1 bg-customGray text-descriptionColor  text-base font-normal leading-none outline-none"
        />
      </div>
    </>
  );
}
