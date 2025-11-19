import React from 'react';
import { Label } from '../system/text';

interface CategoryTagProps {
  category: string;
  isActive?: boolean;
  onClick?: () => void;
}

const CategoryTag = ({
  category,
  isActive = false,
  onClick,
}: CategoryTagProps) => {
  return (
    <button
      className={`inline-flex items-center justify-center px-4 py-2 rounded-full transition-colors cursor-pointer ${
        isActive ? 'bg-[#0057FF] text-white' : 'text-[#6E6E73]'
      }`}
      onClick={onClick}
    >
      <Label>{category}</Label>
    </button>
  );
};

export default CategoryTag;
