'use server';
import { getTeamData } from '@/services/team/getTeamData.server';
import { getTeamProjects } from '@/services/team/getTeamProjects.server';
import { notFound } from 'next/navigation';
import TeamSidebar from './TeamSidebar';
import ProfileIcon from '@/app/components/card/portfolio/ProfileIcon';
import ProjectGrid from '@/app/components/project/components/ProjectGrid';

const Team = async ({ teamName }: { teamName: string }) => {
  const teamDetail = (await getTeamData(teamName)) ?? notFound();
  const teamProjects = await getTeamProjects(teamName);

  return (
    <div className="w-full flex-row relative responsive-team">
      <ProfileIcon image={teamDetail.profile_image} />
      <TeamSidebar teamDetail={teamDetail} projectCount={teamProjects.length} />
      <section className="w-full">
        <ProjectGrid
          projects={teamProjects}
          className="pl-[3rem] pt-[4.5rem] responsive-teamProjects"
          isTeamProject={true}
        />
      </section>
    </div>
  );
};

export default Team;
