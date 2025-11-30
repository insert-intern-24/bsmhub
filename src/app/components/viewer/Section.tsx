import React from 'react';
import { Label } from '../ui/text/text';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section = ({ title, children }: SectionProps) => {
  return (
    <div className="flex-col gap-[12px] w-full">
      <Label className="text-blue-secondary font-bold whitespace-pre">
        {title}
      </Label>
      <hr className="border-blue-secondary" />
      <div className="w-full">{children}</div>
    </div>
  );
};

export default Section;

