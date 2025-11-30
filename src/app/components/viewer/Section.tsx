import React from 'react';
import SectionHeader from './SectionHeader';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section = ({ title, children }: SectionProps) => {
  return (
    <div className="flex-col gap-[12px] w-full">
      <SectionHeader title={title} />
      <div className="w-full">{children}</div>
    </div>
  );
};

export default Section;

