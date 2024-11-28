'use client';

import React from 'react';

interface TabButtonProps {
  tab: "home" | "project" | "posts";
}

const tabName = {
  "home": "홈",
  "project": "프로젝트",
  "posts": "게시물",
};

const TabButton: React.FC<TabButtonProps> = ({ tab }) => {
  const urlParams = new URLSearchParams(window.location.search);
  const isActive = (urlParams.get('tab') || 'home') === tab;

  return (
      <a className={`text-base font-bold text-${isActive ? 'black' : 'detailColor'}
                    border-${isActive ? 'black' : 'strokeColor'} border-b-[0.12rem]
                    max-h-10 py-2 px-5`} href={`?tab=${tab}`}>
        {tabName[tab]}
      </a>
  );
};

export default TabButton;