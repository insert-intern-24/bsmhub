import React from 'react';
import Image from 'next/image';
import TeamInformation from '@components/Information';
import DetailBoxes from '@components/detail/DetailBoxes';
import Hr from '@components/Hr';
import { UserDataType } from '@models/user';

type TeamPanelProps = Pick<UserDataType, 'profile' | 'details' | 'markdown'>;

const TeamPanel = (TeamPanelProps: TeamPanelProps) => {
  const { profile, details, markdown } = TeamPanelProps;
  return (
    <aside className="max-w-[16.25rem] min-w-[16.25rem] w-full">
      <div className="flex flex-col items-center justify-between w-full mt-3">
        <div className="w-full">
          <Image
            src="/images/profile/default.svg"
            alt="default-profile"
            width={90}
            height={90}
          />
          <p className="text-2xl font-threat text-titleColor">
            {profile?.profile_name}
          </p>
          <p className="text-base text-detailColor">{markdown}</p>
        </div>
        <button className="flex items-center justify-center w-full gap-1 px-5 py-2 mt-2 bg-black rounded-3xl">
          <Image
            src="/images/symbol/pick-plus.svg"
            alt="pick"
            width={14}
            height={14}
          />
          <span className="font-bold text-white max-h-[14px]">Follow</span>
        </button>
        <section className="flex gap-[1.625] flex-col w-full">
          <div className="flex flex-col gap-2 mt-4">
            <TeamInformation name="프로젝트 수" value={12} />
            <TeamInformation name="팔로워" value={12} />
            <TeamInformation name="팔로잉" value={12} />
          </div>
          <Hr />
          <main className="flex flex-col gap-8">
            <DetailBoxes
              details={Array.isArray(details) ? details : []}
              type="col"
            />
          </main>
        </section>
      </div>
    </aside>
  );
};

export default TeamPanel;
