import React from 'react';
import ProjectItem from '@components/ProjectItem';

const TeamProjects = () => {
  return (
    <main className="mt-[8.6rem] flex flex-wrap w-full justify-around">
      <ProjectItem
      tag="개발완료"
      category="Desktop Utility"
      title="SANDDOET-App"
      description="산뜻 - AI 추천 RSS로 정보 습득이 쉬워지는 순간!"
      />
      <ProjectItem
      tag="개발완료"
      category="Desktop Utility"
      title="SANDDOET-App"
      description="산뜻 - AI 추천 RSS로 정보 습득이 쉬워지는 순간!"
      />
      <ProjectItem
      tag="개발완료"
      category="Desktop Utility"
      title="SANDDOET-App"
      description="산뜻 - AI 추천 RSS로 정보 습득이 쉬워지는 순간!"
      />
    </main>
  );
};

export default TeamProjects;
