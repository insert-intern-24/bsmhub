'use client';

import React from 'react';
import Link from 'next/link';
import tabsType from './tabs';

interface TabButtonProps {
  tab: tabsType;
  currentTab: tabsType;
  setTabName: React.Dispatch<React.SetStateAction<"home" | "project" | "posts">>;
}

const tabName = {
  "home": "홈",
  "project": "프로젝트",
  "posts": "게시물",
};

const TabButton: React.FC<TabButtonProps> = ({ tab, currentTab, setTabName }) => {
  const isActive = tab === currentTab;

  return (
      <Link className={`text-base font-bold text-${isActive ? 'black' : 'detailColor'}
                    border-${isActive ? 'black' : 'strokeColor'} border-b-[0.12rem]
                    max-h-10 py-2 px-5`} href={`?tab=${tab}`} 
                    onClick={() => setTabName(tab)}
                    >
        {tabName[tab]}
      </Link>
  );
};

export default TabButton;