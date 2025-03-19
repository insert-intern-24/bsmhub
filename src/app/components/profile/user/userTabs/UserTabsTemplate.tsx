import TabButton from '@components/TabButton';
import tabsType from '../../../tabs';
import { UserDataType } from '@models/user';

import UserHome from '@components/profile/user/UserHome';
import UserProjects from '@components/profile/user/UserProjects';
import UserPosts from '@components/profile/user/UserPosts';
import UserCollections from '@components/profile/user/UserCollections';

const tabComponents = (
  userData: UserDataType,
): { [key: string]: JSX.Element } => ({
  home: <UserHome userData={userData} />,
  project: <UserProjects userData={userData} />,
  posts: <UserPosts />,
  collections: <UserCollections userData={userData} />,
});

const UserTabsTemplate: React.FC<{
  tabName: tabsType;
  setTabName?: React.Dispatch<React.SetStateAction<tabsType>>;
  userData: UserDataType;
}> = ({ tabName, setTabName, userData }) => {
  const tabs = ['home', 'project', 'posts', 'collections'] as const;

  return (
    <>
      <section>
        <nav className="border-strokeColor border-b-[1px]">
          <ul className="flex">
            {tabs.map((tab, index) => (
              <TabButton 
                key={index}
                tab={tab}
                currentTab={tabName}
                setTabName={setTabName}
              />
            ))}
          </ul>
        </nav>
      </section>
      <section>
        <>{tabComponents(userData)[tabName]}</>
      </section>
    </>
  );
};

export default UserTabsTemplate;
