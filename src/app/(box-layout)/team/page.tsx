import React from 'react';
import { getAllTeams, getMyTeams } from '@/services/team/getTeam.server';
import { transformTeamToPortfolioCard } from '@/utils/transformTeamToPortfolioCard';
import CollectClient from '@/app/components/collect/CollectClient';
import getAccount from '@/services/auth/getAccount.server';

interface TeamPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function TeamPage({ searchParams }: TeamPageProps) {
  const params = await searchParams;
  const isMine = params.mine === 'true';

  let teams = null;

  if (isMine) {
    const user = await getAccount();
    if (user?.id) {
      teams = await getMyTeams(user.id);
    } else {
      teams = [];
    }
  } else {
    teams = await getAllTeams();
  }

  const transformedTeams = teams?.map(transformTeamToPortfolioCard) ?? [];

  return (
    <div className="container mx-auto pt-8">
      <CollectClient initialPortfolios={transformedTeams} type="team" />
    </div>
  );
}
