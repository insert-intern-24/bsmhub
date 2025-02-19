import React from 'react';
import Select from './Select';
import Input from './Input';

export default function Search() {
  return (
    <>
      <div className="flex pb-6 flex-col items-start gap-4 self-stretch border-b border-[#D6E0EB]">
        <Select />
        <Input />
      </div>
    </>
  );
}
