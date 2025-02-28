import TeamPanel from '@components/profile/team/TeamPanel';
import ProjectItems from '@components/ProjectItems';
import { UserDataType } from '@models/user';

const TeamHome = ({ userData }: { userData: UserDataType }) => {
  return (
    <main className="flex gap-16">
      <TeamPanel
        profile={userData.profile}
        details={userData.details}
        markdown={userData.markdown}
      />
      <ProjectItems projects={userData.projects} />
    </main>
  );
};

export default TeamHome;
