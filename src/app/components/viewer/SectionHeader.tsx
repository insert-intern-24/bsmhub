import React from 'react';
import { Label } from '@/app/components/ui/text/text';

interface SectionHeaderProps {
  title: string;
}

const SectionHeader = ({ title }: SectionHeaderProps) => {
  return (
    <div className="flex-col gap-[10px] w-full">
      <div className="flex gap-[3px] items-center">
        <Label className="text-blue-secondary font-bold whitespace-pre">
          {title}
        </Label>
      </div>
      <hr className="border-blue-secondary" />
    </div>
  );
};

export default SectionHeader;

