import React from 'react';
import DetailBoxes from '@components/detail/DetailBoxes';
import ProjectItem from '@components/ProjectItem';
import { userDataType } from '@/app/models/user';


const UserHome = ({ userData }: { userData: userDataType }) => {
  const StatusTag: Record<number, string> = {
	1: "개발중",
	2: "서비스 중",
	3: "개발완료",
	4: "기획중"
  }

  return (	
	<div>
      <div className="w-full max-h-32 text-titleColor mt-1 mb-7">{userData?.markdown}</div>
	  <div className="w-full h-fit flex flex-wrap gap-[0.7rem]">
		<DetailBoxes details={userData?.details?.details}/>
	  </div>
	  <h3 className="text-titleColor font-bold text-2xl mt-2 mb-2">개인 프로젝트</h3>
	  <div className="flex gap-[0.7rem] flex-wrap">
		{userData?.projects.map(project => (
		  <ProjectItem
		  	key={project.project_id}
			tag={StatusTag[project.status]}
			category={userData.categories.find(c => c.category_id === project.category_id)?.category_name || ''}
			title={project.project_name} 
			description={project.description}
		  />
		))}
	  </div>
	</div>
  );
};

export default UserHome;
