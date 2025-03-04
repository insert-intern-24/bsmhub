import React, { useState, useEffect } from 'react';
import { SearchQuery } from '@/app/models/projectSearch';

export interface Option {
  text: string;
  id: string;
  value: number;
}

interface SelectBoxProps {
  options?: Option[];
  setSearchQuery: React.Dispatch<React.SetStateAction<SearchQuery>>;
}

const removeDuplicateOptions = (options: Option[]): Option[] => {
  const uniqueOptions = new Map<string, Option>();
  options.forEach((option) => {
    if (!uniqueOptions.has(option.text)) {
      uniqueOptions.set(option.text, option);
    }
  });
  return Array.from(uniqueOptions.values());
};

export default function SelectBox({ options, setSearchQuery }: SelectBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>('전체');
  const [uniqueOptions, setUniqueOptions] = useState<Option[]>([]);

  useEffect(() => {
    if (options) {
      setUniqueOptions(removeDuplicateOptions(options));
    }
  }, [options]);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleOptionClick = (text: string, id: string, value: number) => {
    setSelectedValue(text);
    setSearchQuery((prev) => {
      if (
        prev.selectedTags &&
        prev.selectedTags?.map((tag) => tag.name).includes(text)
      ) {
        return {
          ...prev,
          selectedTags: prev.selectedTags.filter((tag) => tag.name !== text),
        };
      } else {
        return {
          ...prev,
          selectedTags: [
            ...(prev.selectedTags || []),
            { name: text, id: id, value: value },
          ],
        };
      }
    });
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
          {uniqueOptions &&
            uniqueOptions.map((option) => (
              <div
                key={option.value}
                className="p-2 cursor-pointer hover:bg-gray-200 text-[#8A949E] text-[17px] font-normal leading-[25.5px] tracking-[0px] flex-1"
                onClick={() =>
                  handleOptionClick(option.text, option.id, option.value)
                }
              >
                {option.text}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
