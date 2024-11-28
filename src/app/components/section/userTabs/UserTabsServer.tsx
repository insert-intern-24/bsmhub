// UserTabs.tsx (서버 컴포넌트)
import tabsType from '../../tabs';
import { headers } from 'next/headers';

import UserTabsTemplate from './UserTabsTemplate';

const UserTabs = async () => {
  const headersList = await headers();
  const tabMatch = headersList.get('x-url')?.match(/tab=(home|project|posts)/);
  const initialTab = (tabMatch ? tabMatch[1] : 'home') as tabsType;
  return (
    <>
      <UserTabsTemplate tabName={initialTab} />
    </>
  );
};

export default UserTabs;
