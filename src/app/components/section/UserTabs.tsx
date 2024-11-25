"use client";

import React, { useState, useEffect } from "react";
import UserHome from "@components/section/UserHome";
import UserProjects from "@components/section/UserProjects";
import UserPosts from "@components/section/UserPosts";

const tabComponents: { [key: string]: JSX.Element } = {
  home: <UserHome />,
  project: <UserProjects />,
  posts: <UserPosts />,
};

const UserTabs = () => {
  const [tabName, setTabName] = useState("home");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get("tab");
    setTabName(tab && tabComponents[tab] ? tab : "home");
  }, [window.location.search]);

  return <div>{tabComponents[tabName]}</div>;
};

export default UserTabs;
