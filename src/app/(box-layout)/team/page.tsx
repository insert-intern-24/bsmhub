import React from 'react';
import {
  getAllTeams,
  getTeamsByProfileName,
} from '@/services/team/getTeam.server';
import { transformTeamToPortfolioCard } from '@/utils/transformTeamToPortfolioCard';
import CollectClient from '@/app/components/feature/collect/CollectClient';

interface TeamPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function TeamPage({ searchParams }: TeamPageProps) {
  const params = await searchParams;
  const profileName = params.profileName;

  let teams = null;

  if (profileName && typeof profileName === 'string') {
    teams = await getTeamsByProfileName(profileName);
  } else {
    teams = await getAllTeams();
  }

  const transformedTeams = teams?.map(transformTeamToPortfolioCard) ?? [];

  return (
    <div className="container mx-auto pt-8">
      <CollectClient
        key={typeof profileName === 'string' ? profileName : 'all'}
        initialPortfolios={transformedTeams}
        type="team"
        profileName={typeof profileName === 'string' ? profileName : undefined}
      />
    </div>
  );
}
