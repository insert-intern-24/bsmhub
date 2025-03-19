import React from 'react';
import DetailBoxes from '@components/detail/DetailBoxes';
import ProjectItems from '@components/ProjectItems';
import { UserDataType } from '@models/user';

const UserHome = ({ userData }: { userData: UserDataType }) => {
  return (
    <div>
      <div className="w-full mt-1 max-h-32 text-titleColor mb-7">
        {userData?.markdown}
      </div>
      <div className="w-full h-fit flex flex-wrap gap-[0.7rem] bg-[#FCFCFC] pt-2">
        <DetailBoxes type="row" details={userData?.details?.details} />
      </div>
      <h3 className="mt-4 mb-2 text-2xl font-bold text-titleColor">
        개인 프로젝트
      </h3>
      <div className="flex gap-[0.7rem] flex-wrap">
        <ProjectItems projects={ userData.projects }/>
      </div>
    </div>
  );
};

export default UserHome;
