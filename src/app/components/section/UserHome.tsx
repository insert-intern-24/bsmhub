import React from 'react';
import DetailBoxes from '@components/detail/DetailBoxes';
import ProjectItem from '@components/ProjectItem';
import dummy from '../../user/dummy.json';

const UserHome = () => {
	return (
		<div>
      <div className="w-full max-h-32 text-titleColor mt-4">마크다운 입력하는 곳</div>
				<div className="w-full h-fit flex flex-wrap gap-[0.7rem]">
					<DetailBoxes contents={dummy.contents}/>
				</div>
			<h3 className="text-titleColor font-bold text-2xl mt-2 mb-2">개인 프로젝트</h3>
			<div className="flex gap-[0.7rem] flex-wrap">
				<ProjectItem tag="개발완료" category="Desktop Utility" title="SANDDOET-App" description="산뜻 - AI 추천 RSS로 정보 습득이 쉬워지는 순간!" />
				<ProjectItem tag="개발완료" category="Desktop Utility" title="SANDDOET-App" description="산뜻 - AI 추천 RSS로 정보 습득이 쉬워지는 순간!" />
				<ProjectItem tag="개발완료" category="Desktop Utility" title="SANDDOET-App" description="산뜻 - AI 추천 RSS로 정보 습득이 쉬워지는 순간!" />
				<ProjectItem tag="개발완료" category="Desktop Utility" title="SANDDOET-App" description="산뜻 - AI 추천 RSS로 정보 습득이 쉬워지는 순간!" />
			</div>
		</div>
	);
};

export default UserHome;
