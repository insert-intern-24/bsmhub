import React from 'react';
import { getAllTeams } from '@/services/server/team/getTeam';
import { transformTeamToCard } from '../../../utils/transformTeamToCard';
import CollectClient from '@/app/components/collect/CollectClient';

export default async function TeamPage() {
  const teams = await getAllTeams();
  const transformedTeams = teams?.map(transformTeamToCard) ?? [];

  return (
    <div className="container mx-auto pt-8">
      <CollectClient initialProjects={transformedTeams} type="team" />
    </div>
  );
}
