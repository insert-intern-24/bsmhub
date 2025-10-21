import React from 'react';
import tw from 'twin.macro';
import styled from 'styled-components';
import { Label } from '../system/text';

interface CategoryTagProps {
  category: string;
  isActive?: boolean;
  onClick?: () => void;
}

const TagButton = styled.button<{ $isActive: boolean }>`
  ${tw`inline-flex-center px-3 py-1 rounded-full border-[0.8px] transition-colors cursor-pointer`}
  ${({ $isActive }) => 
    $isActive 
      ? tw`bg-black text-white border-black` 
      : tw`bg-white text-gray-base border-light-gray-outline hover:border-gray-base`
  }
`;

const CategoryTag = ({ category, isActive = false, onClick }: CategoryTagProps) => {
  return (
    <TagButton $isActive={isActive} onClick={onClick}>
      <Label className={isActive ? 'text-white' : 'text-gray-base'}>
        {category}
      </Label>
    </TagButton>
  );
};

export default CategoryTag;