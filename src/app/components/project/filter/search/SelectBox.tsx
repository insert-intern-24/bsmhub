import React from 'react';

interface Option {
  id: number;
  text: string;
}

interface DataItem {
  id: number;
  name: string;
}

interface SelectBoxProps {
  options?: Option[];
  data?: DataItem[];
}

export default function SelectBox({ options, data }: SelectBoxProps) {
  return (
    <>
      <select
        name=""
        id=""
        className="flex w-[13rem] flex-col items-start gap-2 rounded-3xl border border-[#D8D8D8] min-h-[3rem]"
      >
        <option value="">전체</option>
        {options &&
          options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.text}
            </option>
          ))}
        {data &&
          data.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
      </select>
    </>
  );
}
