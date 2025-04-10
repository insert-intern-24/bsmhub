import React from 'react';
import Image from 'next/image';
import deleteIcon from '@public/images/icon/delete.svg';
import { SearchQuery, Topics } from '@/app/models/setSearch';

export default function TagList({
  tags,
  setSearchQuery,
}: {
  tags?: Topics[];
  setSearchQuery: React.Dispatch<React.SetStateAction<SearchQuery>>;
}) {
  const handleDelete = (tagToDelete: Topics) => {
    setSearchQuery((prevQuery) => ({
      ...prevQuery,
      selectedTags: prevQuery.selectedTags?.filter(
        (tag: Topics) => tag.name !== tagToDelete.name,
      ),
    }));
  };

  return (
    <>
      <div className="flex items-start content-start gap-x-3 gap-y-4 flex-wrap ">
        {tags?.map((tag, index) => (
          <div
            key={index}
            className="flex p-3 justify-center items-center gap-[0.5rem] rounded-full border border-[#CDD1D5] bg-white"
          >
            <span className="text-black text-base font-normal leading-[150%] tracking-normal select-none">
              {tag.name}
            </span>
            <Image
              src={deleteIcon}
              alt="deleteIcon"
              width={14}
              height={14}
              onClick={() => handleDelete(tag)}
              className="cursor-pointer select-none"
            />
          </div>
        ))}
      </div>
    </>
  );
}
