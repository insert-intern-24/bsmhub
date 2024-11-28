import TabButton from '@components/TabButton';
import tabsType from '../../tabs';

import UserHome from '@components/section/UserHome';
import UserProjects from '@components/section/UserProjects';
import UserPosts from '@components/section/UserPosts';

const tabComponents: { [key: string]: JSX.Element } = {
  home: <UserHome />,
  project: <UserProjects />,
  posts: <UserPosts />,
};

const UserTabsTemplate: React.FC<{
  tabName: tabsType;
  setTabName?: React.Dispatch<React.SetStateAction<tabsType>>;
}> = ({ tabName, setTabName }) => {
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
        <div>{tabComponents[tabName]}</div>
      </section>
    </>
  );
};

export default UserTabsTemplate;
