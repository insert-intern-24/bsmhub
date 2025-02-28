import TabButton from '@components/TabButton';
import tabsType from '../../tabs';
import { userDataType } from '@/app/models/user';

import UserHome from '@components/section/UserHome';
import UserProjects from '@components/section/UserProjects';
import UserPosts from '@components/section/UserPosts';

const tabComponents = (userData: userDataType): { [key: string]: JSX.Element } => ({
  home: <UserHome userData={userData} />,
  project: <UserProjects userData={userData} />,
  posts: <UserPosts />,
});

const UserTabsTemplate: React.FC<{
  tabName: tabsType;
  setTabName?: React.Dispatch<React.SetStateAction<tabsType>>;
  userData: userDataType;
}> = ({ tabName, setTabName, userData }) => {

  return (
    <>
      <section>
        <nav className="border-strokeColor border-b-[1px]">
          <ul className="flex">
            <TabButton
              tab="home"
              currentTab={tabName}
              setTabName={setTabName}
            />
            <TabButton
              tab="project"
              currentTab={tabName}
              setTabName={setTabName}
            />
            <TabButton
              tab="posts"
              currentTab={tabName}
              setTabName={setTabName}
            />
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
