"use client";

import React, { useState } from "react";
import UserHome from "@components/section/UserHome";
import UserProjects from "@components/section/UserProjects";
import UserPosts from "@components/section/UserPosts";
import TabButton from '@components/TabButton';
import { useSearchParams } from 'next/navigation'
import tabsType from '../tabs';

const tabComponents: { [key: string]: JSX.Element } = {
  home: <UserHome />,
  project: <UserProjects />,
  posts: <UserPosts />,
};

const UserTabs = () => {
  const [tabName, setTabName] = useState((useSearchParams().get('tab') || 'home') as tabsType);
  return <>
  <section>
    <nav className="border-strokeColor border-b-[1px]">
      <ul className="flex">
        <TabButton tab="home" currentTab={tabName} setTabName={setTabName}/>
        <TabButton tab="project" currentTab={tabName} setTabName={setTabName}/>
        <TabButton tab="posts" currentTab={tabName} setTabName={setTabName}/>
      </ul>
    </nav>
  </section>
  <section>
    <div>{tabComponents[tabName]}</div>
  </section>
</>
};

export default UserTabs;
