import React from 'react';
import Image from 'next/image';
import deleteIcon from '@public/images/icon/delete.svg';

const tags = [{ name: 'Web' }, { name: 'React' }, { name: 'Vue' }];

export default function TagList() {
  return (
    <>
      <div className="flex items-start content-start gap-x-3 gap-y-4 flex-wrap ">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex px-3 py-2 justify-center items-center gap-[0.5rem] rounded-full border border-[#CDD1D5] bg-white"
          >
            <span className="text-black text-base font-normal leading-[150%] tracking-normal">
              {tag.name}
            </span>
            <Image src={deleteIcon} alt="deleteIcon" width={14} height={14} />
          </div>
        ))}
      </div>
    </>
  );
}
