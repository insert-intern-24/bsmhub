import React from 'react'
import Image from 'next/image';
import TeamInformation from '@components/information/Information';
import Hr from '@components/Hr';

const TeamPanel = () => {
  return (
    <aside>
        <Image
          src="images/profile/default.svg"
          alt="default-profile"
          width={90}
          height={90}
        />
        <div className="flex justify-between items-center mt-3">
          <div>
            <div>
              <p className="text-2xl font-threat text-titleColor">
                GilDong Hong
              </p>
              <p className="text-detailColor text-base">1학년 2반 홍길동</p>
            </div>
            <button className="w-[13.75rem] flex gap-1 items-center justify-center bg-black px-5 py-2 rounded-3xl mt-2">
              <Image
                src="images/symbol/pick-plus.svg"
                alt="pick"
                width={14}
                height={14}
              />
              <span className="font-bold text-white max-h-[14px]">Follow</span>
            </button>
            <aside className="flex gap-[1.625] flex-col">
              <div className="flex gap-2 flex-col mt-4">
                <TeamInformation name="대상" value={12} />
                <TeamInformation name="참여인원" value={12} />
                <TeamInformation name="조회수" value={12} />
              </div>
              <Hr />
            </aside>
          </div>
        </div>
      </aside>
  )
}

export default TeamPanel