import React from "react";
import PopularProject from "../components/community/additional/PopularProject";
import ProjectAd from "../components/community/additional/ProjectAd";
import Search from "../components/community/search/Search";
import SuggestProfile from "../components/community/profile/SuggestProfile";
import DefaultFeed from "@components/community/feed/DefaultFeed";
import NotificationFeed from "../components/community/feed/NotificationFeed";

function MainCommunity() {
  return (
    <div className="flex gap-[0.625rem] py-[6.875rem]">
      <div className="flex w-full flex-col items-start gap-3">
        <Search />
        <NotificationFeed />
        <DefaultFeed />
        <SuggestProfile />
      </div>
      <div className="flex w-[18.75rem] flex-col items-start gap-[0.625rem] ">
        <PopularProject />
        <ProjectAd />
      </div>
    </div>
  );
}

export default MainCommunity;
