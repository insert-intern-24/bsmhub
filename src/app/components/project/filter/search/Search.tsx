import React from 'react';
import Select from './Select';
import Input from './Input';
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
      <div className="flex pb-6 flex-col items-start gap-4 self-stretch border-b border-[#D6E0EB]">
        <Select setSearchQuery={setSearchQuery} />
        <Input
          inputQuery={searchQuery.inputQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
    </>
  );
}
