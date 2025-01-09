import React, { useState } from 'react';

const TagName = [
  { name: '전체' },
  { name: '프로젝트' },
  { name: '블로그' },
  { name: '글' },
];

export default function Tag() {
  const [selectedTag, setSelectedTag] = useState<string>('전체');

  const handleClick = (tag: string) => {
    setSelectedTag(tag);
  };

  return (
    <>
      {TagName.map((tag, index) => (
        <div
          key={index}
          onClick={() => handleClick(tag.name)}
          className={`flex px-2 py-4 flex-col justify-center items-center gap-[0.625rem] cursor-pointer text-base font-normal leading-[0.5rem] font-pretendard ${
            selectedTag === tag.name
              ? 'bg-black text-white rounded-xl border border-black'
              : 'bg-white text-black rounded-xl border border-customGray'
          }`}
        >
          {tag.name}
        </div>
      ))}
    </>
  );
}
