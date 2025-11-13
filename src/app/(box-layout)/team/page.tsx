import React from 'react';
import { getAllTeams } from '@/services/team/getTeam.server';
import { transformTeamToPortfolioCard } from '@/utils/transformTeamToPortfolioCard';
import CollectClient from '@/app/components/collect/CollectClient';

export default async function TeamPage() {
  const teams = await getAllTeams();
  const transformedTeams = teams?.map(transformTeamToPortfolioCard) ?? [];

  return (
    <div className="container mx-auto pt-8">
      <CollectClient initialPortfolios={transformedTeams} type="team" />
    </div>
  );
}
