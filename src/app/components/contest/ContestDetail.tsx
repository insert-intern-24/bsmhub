import React from 'react';
import judgeIcon from '@public/images/symbol/judge.svg';
import awardIcon from '@public/images/symbol/award.svg';
import Image from 'next/image';

interface ContestDetailProps {
  description?: string;
  judges?: string[];
  awards?: {
    title: string;
    project: string;
  }[];
}

function ContestDetail({ description, judges, awards }: ContestDetailProps) {
  const detail = description
    ? { title: '소개', content: <p>{description}</p> }
    : judges
    ? {
        title: '심사위원',
        content: (
          <ul>
            {judges.map((judge, index) => (
              <li key={index} className="flex gap-1 itmes-center">
                <Image
                  src={judgeIcon}
                  alt="judge"
                  width={(14 * 12) / 16}
                  height={(14 * 12) / 16}
                />
                {judge}
              </li>
            ))}
          </ul>
        ),
      }
    : awards
    ? {
        title: '수상 작품',
        content: (
          <ul>
            {awards.map((award, index) => (
              <li key={index} className="flex gap-1">
                <Image
                  src={awardIcon}
                  alt="award"
                  width={(14 * 12) / 16}
                  height={(14 * 12) / 16}
                />
                <div>
                  {award.project} <b>{award.title}</b>
                </div>
              </li>
            ))}
          </ul>
        ),
      }
    : null;

  if (!detail) return null;

  return (
    <div className="text-[0.875rem] flex flex-col gap-1">
      <h2 className="text-titleColor">{detail.title}</h2>
      <div className="text-detailColor">{detail.content}</div>
    </div>
  );
}

export default ContestDetail;
