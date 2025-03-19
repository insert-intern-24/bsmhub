// UserTabs.tsx (서버 컴포넌트)
import tabsType from '../../../tabs';
import { UserDataType } from '@models/user';
import { headers } from 'next/headers';

import UserTabsTemplate from './UserTabsTemplate';

const UserTabs = async ({ userData }: { userData: UserDataType }) => {
  const headersList = await headers();
  const tabMatch = headersList.get('x-url')?.match(/tab=(home|project|posts|collections)/);
  const initialTab = (tabMatch ? tabMatch[1] : 'home') as tabsType;
  return (
    <>
      <UserTabsTemplate tabName={initialTab} userData={userData} />
    </>
  );
};

export default UserTabs;
