'use client';
// UserTabs.tsx (클라이언트 컴포넌트)
import tabsType from '../../tabs';
// import { headers } from 'next/headers';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import UserTabsTemplate from './UserTabsTemplate';

const UserTabsClient = () => {
  const [tabName, setTabName] = useState(
    (useSearchParams().get('tab') || 'home') as tabsType,
  );
  useEffect(() => {
    const serverRenderElement = document.querySelector(
      '.serverRender',
    ) as HTMLElement;
    if (serverRenderElement) serverRenderElement.style.display = 'none';
  }, []);
  return (
    <>
      <UserTabsTemplate tabName={tabName} setTabName={setTabName} />
    </>
  );
};

export default UserTabsClient;
