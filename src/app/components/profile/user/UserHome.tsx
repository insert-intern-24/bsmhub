import React from 'react';
import DetailBoxes from '@components/detail/DetailBoxes';
import ProjectItem from '@components/ProjectItem';
import { UserDataType } from '@models/user';
import { StatusTag } from '@models/project';

const UserHome = ({ userData }: { userData: UserDataType }) => {
  return (
    <div>
      <div className="w-full mt-1 max-h-32 text-titleColor mb-7">
        {userData?.markdown}
      </div>
      <div className="w-full h-fit flex flex-wrap gap-[0.7rem]">
        <DetailBoxes type="row" details={userData?.details?.details} />
      </div>
      <h3 className="mt-2 mb-2 text-2xl font-bold text-titleColor">
        개인 프로젝트
      </h3>
      <div className="flex gap-[0.7rem] flex-wrap">
        {userData?.projects.map((project) => (
          <ProjectItem
            key={project.project_id}
            tag={StatusTag[project.status]}
            category={
              userData.categories.find(
                (c) => c.category_id === project.category_id,
              )?.category_name || ''
            }
            title={project.project_name}
            description={project.description}
          />
        ))}
      </div>
    </div>
  );
};

export default UserHome;
