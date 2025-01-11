import React from 'react';
import ContestItem from './ContestItem';

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

interface ContestListProps {
  contests: Contest[];
  onContestClick: (contest: Contest) => void;
}

function ContestList({ contests, onContestClick }: ContestListProps) {
  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-wrap gap-4">
        {contests.map((contest, key) => (
          <ContestItem
            key={key}
            title={contest.title}
            startDate={contest.startDate}
            endDate={contest.endDate}
            onClick={() => onContestClick(contest)}
          />
        ))}
      </div>
    </div>
  );
}

export default ContestList;
