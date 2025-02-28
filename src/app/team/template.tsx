import React from 'react';
import TeamPanel from '@components/profile/team/TeamPanel';
import TeamProjects from '@components/profile/team/TeamProjects';

const TeamTemplate = () => {
  return (
    <main className='flex gap-16'>
      <TeamPanel/>
      <TeamProjects/>
    </main>
  );
};

export default TeamTemplate;
