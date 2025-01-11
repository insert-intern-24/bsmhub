import React from 'react';
import ContestInformation from './ContestInformation';
import ContestDetail from './ContestDetail';

interface Contest {
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  judges: string[];
  awards: {
    title: string;
    project: string;
  }[];
}

function SelectedContestPanel({ contest }: { contest: Contest }) {
  return (
    <div className="w-[21.0625rem] flex flex-col shrink-0 [background:linear-gradient(180deg,rgba(47,66,205,0.07)_0%,rgba(255,255,255,0.07)_100%)]">
      <div className="mx-10 flex flex-col mt-[12.5rem]">
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-[0.4rem]">
              <span className="text-[1.5rem] font-semibold">
                {contest.title}
              </span>
              <span className="text-[1rem] font-normal text-detailColor">
                {contest.startDate} ~ {contest.endDate}
              </span>
            </div>
            <div className="w-full py-2 bg-titleColor rounded-[30px] flex justify-center items-center">
              <div className="font-semibold text-white">투표하기</div>
            </div>
          </div>
          <div className="flex flex-col gap-1 text-[1rem]">
            <ContestInformation name="대상" value="1학년" />
            <ContestInformation name="참여 인원" value="64" />
            <ContestInformation name="조회수" value="1089" />
          </div>
        </section>
        <hr className="w-full h-[1px] bg-strokeColor my-6"/>
        <section className="flex flex-col gap-8">
          <ContestDetail description={contest.description} />
          <ContestDetail judges={contest.judges} />
          <ContestDetail awards={contest.awards} />
        </section>
      </div>
    </div>
  );
}

export default SelectedContestPanel;
