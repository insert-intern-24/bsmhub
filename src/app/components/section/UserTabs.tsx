// UserTabs.tsx (서버 컴포넌트)
import UserHome from '@components/section/UserHome';
import UserProjects from '@components/section/UserProjects';
import UserPosts from '@components/section/UserPosts';
import tabsType from '../tabs';
import TabButton from '@components/TabButton';
import { headers } from 'next/headers';

const tabComponents: { [key: string]: JSX.Element } = {
  home: <UserHome />,
  project: <UserProjects />,
  posts: <UserPosts />,
};

const UserTabs = async () => {
  const headersList = await headers();
  const tabMatch = headersList.get('x-url')?.match(/tab=(home|project|posts)/);
  const initialTab = (tabMatch ? tabMatch[1] : 'home') as tabsType;
  return (
    <>
      <section>
        <nav className="border-strokeColor border-b-[1px]">
          <ul className="flex">
            <TabButton tab="home" currentTab={initialTab} />
            <TabButton tab="project" currentTab={initialTab} />
            <TabButton tab="posts" currentTab={initialTab} />
          </ul>
        </nav>
      </section>
      <section>
        <div>{tabComponents[initialTab]}</div>
      </section>
    </>
  );
};

export default UserTabs;
