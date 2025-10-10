'use client';

import Link from 'next/link';
import PortfolioCard from '../components/card/portfolio/PortfolioCard';
import { PortfolioData } from './types';
import Inputs from '../components/modal/inputs/SingleInput';
import { useState } from 'react';

export default function SearchTab({
  portfolioData,
}: {
  portfolioData: PortfolioData[];
}) {
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <div className="container py-9 px-11 flex-row gap-4 min-h-dvh">
      <div>
        <Inputs
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
        ></Inputs>
      </div>
      <div className="flex-col gap-3 p-4 flex-1 bg-light-gray-footer-bg">
        {portfolioData.length > 0
          ? portfolioData
              .filter((data) => {
                return data.profile.name
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase());
              })
              .map((data, index) => (
                <Link href={`/portfolio/${data.profile.name}`} key={index}>
                  <PortfolioCard
                    profile={data.profile}
                    projects={data.projects}
                  />
                </Link>
              ))
          : '포트폴리오 데이터가 없습니다'}
      </div>
    </div>
  );
}
