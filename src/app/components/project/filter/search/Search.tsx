import React from 'react';
import Select from './Select';
import Input from './SearchInput';
import { SearchQuery } from '@/app/models/projectSearch';

export default function Search({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: SearchQuery;
  setSearchQuery: React.Dispatch<React.SetStateAction<SearchQuery>>;
}) {
  return (
    <>
      <div className="flex pb-6 flex-col items-start self-stretch border-b border-[#D6E0EB] gap-6 w-full">
        <div className="flex flex-col gap-4 w-full">
          <Select setSearchQuery={setSearchQuery} />
          <Input
            inputQuery={searchQuery.inputQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
      </div>
    </>
  );
}
