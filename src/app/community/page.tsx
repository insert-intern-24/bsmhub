import React from 'react';
import PopularProject from '../components/community/additional/PopularProject';
import ProjectAd from '../components/community/additional/ProjectAd';
import Search from '../components/community/search/Search';
import SuggestProfile from '../components/community/profile/SuggestProfile';
import FeedList from '../components/community/feed/FeedList';

function MainCommunity() {
  return (
    <main className="flex gap-[0.625rem] py-[6.875rem]">
      <section className="flex w-full flex-col items-start gap-3 max-w-[66rem]">
        <Search />
        <FeedList />
        <SuggestProfile />
      </section>
      <aside className="flex w-[18.75rem] flex-col items-start gap-[0.625rem] ">
        <PopularProject />
        <ProjectAd />
      </aside>
    </main>
  );
}

export default MainCommunity;
