'use client';

import { useState } from 'react';

interface TabsProps {
  tabs?: string[];
  activeTab?: number;
  onTabChange?: (index: number) => void;
}

export default function Tabs({
  tabs = ['웹', '데스크톱앱', '모바일앱'],
  activeTab: controlled,
  onTabChange,
}: TabsProps) {
  const [internal, setInternal] = useState(0);
  const active = controlled ?? internal;

  const handleClick = (index: number) => {
    if (onTabChange) {
      onTabChange(index);
    } else {
      setInternal(index);
    }
  };

  return (
    <div className="flex items-center border-b border-[#f1f1f1]">
      {tabs.map((tab, i) => (
        <button
          key={i}
          onClick={() => handleClick(i)}
          className={`h-[42px] px-[19px] flex items-center justify-center transition-colors ${
            active === i
              ? 'border-b-2 border-black text-black'
              : 'text-[#5e5e5e] hover:text-black'
          }`}
        >
          <span className="text-[16px] leading-[24px] tracking-[0.0912px]">
            {tab}
          </span>
        </button>
      ))}
    </div>
  );
}
