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
    <aside className="max-w-[21.0625rem] bg-contest-gradient px-10">
      <div className="mt-[12.5rem]">
        <header className="flex flex-col gap-4">
          <div className="flex flex-col gap-[0.4rem]">
            <span className="text-2xl font-bold">{contest.title} </span>
            <span className="text-base text-detailColor">
              {contest.startDate} ~ {contest.endDate}
            </span>
          </div>
          <button className="w-full py-2 bg-titleColor rounded-[30px] font-bold text-white">
            투표하기
          </button>
          <div className="flex flex-col gap-1 text-[1rem]">
            <ContestInformation name="대상" value="1학년" />
            <ContestInformation name="참여 인원" value="64" />
            <ContestInformation name="조회수" value="1089" />
          </div>
        </header>
        <hr className="w-full h-[1px] bg-strokeColor my-6" />
        <main className="flex flex-col gap-8">
          <ContestDetail description={contest.description} />
          <ContestDetail judges={contest.judges} />
          <ContestDetail awards={contest.awards} />
        </main>
      </div>
    </aside>
  );
}

export default SelectedContestPanel;
