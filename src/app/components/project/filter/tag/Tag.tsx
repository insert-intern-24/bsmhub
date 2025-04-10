import React from 'react';
import TagList from './TagList';
import Image from 'next/image';
import reset from '@public/images/icon/reset.svg';
import { SearchQuery } from '@/app/models/setSearch';

export default function Tag({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: SearchQuery;
  setSearchQuery: React.Dispatch<React.SetStateAction<SearchQuery>>;
}) {
  const handleReset = () => {
    setSearchQuery((prevQuery) => ({
      ...prevQuery,
      selectedTags: [],
    }));
  };

  return (
    <>
      <div className="flex items-center gap-4 self-stretch">
        <span className="text-black text-base font-bold leading-[150%] tracking-normal select-none">
          선택된 필터{' '}
          <span className="text-[#0B50D0]">
            {searchQuery.selectedTags?.length || 0}
          </span>
        </span>
        <div className="flex items-center content-center gap-2 flex-1 flex-wrap">
          <div
            className="flex p-3 justify-center items-start rounded-full border border-[#CDD1D5] bg-white"
            onClick={handleReset}
          >
            <Image
              src={reset}
              alt="reset"
              width={15}
              height={15}
              className="select-none"
            />
          </div>
          <TagList
            tags={searchQuery.selectedTags}
            setSearchQuery={setSearchQuery}
          />
        </div>
      </div>
    </>
  );
}
