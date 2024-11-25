// TabState.tsx (클라이언트 컴포넌트)
'use client';

import { useState } from 'react';
import TabButton from '@components/TabButton';
import tabsType from '../tabs';

interface TabStateProps {
  initialTab: tabsType;
}

export function TabState({ initialTab }: TabStateProps) {
  const [tabName, setTabName] = useState<tabsType>(initialTab);

  return (
    <nav className="border-strokeColor border-b-[1px]">
      <ul className="flex">
        <TabButton tab="home" currentTab={tabName} setTabName={setTabName} />
        <TabButton tab="project" currentTab={tabName} setTabName={setTabName} />
        <TabButton tab="posts" currentTab={tabName} setTabName={setTabName} />
      </ul>
    </nav>
  );
}
