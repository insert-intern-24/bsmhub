import React, { useState } from 'react';
import { SearchQuery } from '@/app/models/projectSearch';
import Dropdown from '@/app/components/Dropdown';
export interface Option {
  text: string;
  id: string;
  value: number;
}

interface SelectBoxProps {
  options?: Option[];
  setSearchQuery: React.Dispatch<React.SetStateAction<SearchQuery>>;
}

export default function SelectBox({ options, setSearchQuery }: SelectBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>('전체');

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
    <div className="w-[13rem]">
      <div
        className="flex items-center justify-between p-2 border border-[#D8D8D8] rounded-3xl cursor-pointer"
        onClick={toggleDropdown}
      >
        {selectedValue}
        <span className="ml-2">&#9662;</span>
      </div>
      {isOpen && (
        <div className="z-10 w-full mt-1 bg-white border border-[#D8D8D8] rounded-3xl relative">
          {/* icon, children, onClick */}
          {options && (
            <Dropdown
              items={options.map((option) => ({
                icon: '',
                children: option.text,
                onClick: () =>
                  handleOptionClick(option.text, option.id, option.value),
              }))}
              setOverlayBg={setIsOpen}
            />
          )}
        </div>
      )}
    </div>
  );
}
