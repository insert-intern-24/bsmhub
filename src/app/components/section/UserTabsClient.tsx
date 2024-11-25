'use client';
// UserTabs.tsx (클라이언트 컴포넌트)
import UserHome from '@components/section/UserHome';
import UserProjects from '@components/section/UserProjects';
import UserPosts from '@components/section/UserPosts';
import tabsType from '../tabs';
import TabButton from '@components/TabButton';
// import { headers } from 'next/headers';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

const tabComponents: { [key: string]: JSX.Element } = {
  home: <UserHome />,
  project: <UserProjects />,
  posts: <UserPosts />,
};

const UserTabsClient = () => {
  const [tabName, setTabName] = useState(
    (useSearchParams().get('tab') || 'home') as tabsType,
  );
  return (
    <>
      <script>
        {`
        const serverRenderElement = document.querySelector('.serverRender').style.display = 'none';
        console.log(serverRenderElement);
      `}
      </script>
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

export default UserTabsClient;
