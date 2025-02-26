import React, { useState } from 'react';

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
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>('전체');

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleOptionClick = (value: string) => {
    setSelectedValue(value);
    setIsOpen(false);
  };

  return (
    <div className="relative w-[13rem]">
      <div
        className="flex items-center justify-between p-2 border border-[#D8D8D8] rounded-3xl cursor-pointer"
        onClick={toggleDropdown}
      >
        {selectedValue}
        <span className="ml-2">&#9662;</span>
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-[#D8D8D8] rounded-3xl">
          <div
            className="p-2 cursor-pointer hover:bg-gray-200 text-[#8A949E] text-[17px] font-normal leading-[25.5px] tracking-[0px] flex-1"
            onClick={() => handleOptionClick('전체')}
          >
            전체
          </div>
          {options &&
            options.map((option) => (
              <div
                key={option.id}
                className="p-2 cursor-pointer hover:bg-gray-200 text-[#8A949E] text-[17px] font-normal leading-[25.5px] tracking-[0px] flex-1"
                onClick={() => handleOptionClick(option.text)}
              >
                {option.text}
              </div>
            ))}
          {data &&
            data.map((item) => (
              <div
                key={item.id}
                className="p-2 cursor-pointer hover:bg-gray-200 text-[#8A949E] text-[17px] font-normal leading-[25.5px] tracking-[0px] flex-1"
                onClick={() => handleOptionClick(item.name)}
              >
                {item.name}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
