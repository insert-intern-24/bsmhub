import React from 'react';
import Search from './search/Search';
import Tag from './tag/Tag';

export default function Filter() {
  return (
    <>
      <div className="w-[86.625rem] flex p-10 flex-col items-start gap-6 self-stretch rounded-xl border border-[#DADADA] bg-white">
        <Search />
        <Tag />
      </div>
    </>
  );
}
