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
  ${tw`inline-flex-center px-4 py-2 rounded-full transition-colors cursor-pointer`}
  ${({ $isActive }) =>
    $isActive ? tw`bg-[#0057FF] text-white` : tw`text-[#6E6E73]`}
`;

const CategoryTag = ({
  category,
  isActive = false,
  onClick,
}: CategoryTagProps) => {
  return (
    <TagButton $isActive={isActive} onClick={onClick}>
      <Label>{category}</Label>
    </TagButton>
  );
};

export default CategoryTag;
