'use server';
import { getTeamData } from '@/services/team/getTeamData.server';
import { getTeamProjects } from '@/services/team/getTeamProjects.server';
import { notFound } from 'next/navigation';
import TeamSidebar from '@/app/components/section/team/TeamSidebar';
import ProfileIcon from '@/app/components/ui/profile/ProfileIcon';
import ProjectGrid from '@/app/components/feature/project/components/ProjectGrid';
import SidebarContentLayout from '@/app/components/layout/sidebar/SidebarContentLayout';

const Team = async ({ teamName }: { teamName: string }) => {
  const teamDetail = (await getTeamData(teamName)) ?? notFound();
  const teamProjects = await getTeamProjects(teamName);

  return (
    <div className="w-full relative responsive-team">
      <ProfileIcon image={teamDetail.profile_image} />
      <SidebarContentLayout sidebar={<TeamSidebar teamDetail={teamDetail} projectCount={teamProjects.length} />}>
        <section className="w-full">
          <ProjectGrid
            projects={teamProjects}
            className="pl-[3rem] pt-[4.5rem] responsive-teamProjects"
            isTeamProject={true}
          />
        </section>
      </SidebarContentLayout>
    </div>
  );
};

export default Team;
