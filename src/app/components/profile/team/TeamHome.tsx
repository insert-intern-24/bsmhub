import TeamPanel from '@components/profile/team/TeamPanel';
import TeamProjects from '@components/profile/team/TeamProjects';

const TeamHome = () => {
  return (
    <main className="flex gap-16">
      <TeamPanel />
      <TeamProjects />
    </main>
  );
};

export default TeamHome;
