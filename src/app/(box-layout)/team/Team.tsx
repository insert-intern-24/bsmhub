'use server';
import { getTeamDetail } from '@/services/team/getTeam.serverData';
import { getTeamProjects } from '@/services/team/getTeam.serverProjects';
import { convertFromDatabaseImageURL } from '@/services/supabase/imageHostConverter';
import { notFound } from 'next/navigation';
import TeamSidebar from './TeamSidebar';
import Card from '@/app/components/card/project/ProjectCard';
import ProfileIcon from '@/app/components/card/portfolio/ProfileIcon';

const Team = async ({ teamName }: { teamName: string }) => {
  const teamDetail = (await getTeamDetail(teamName)) ?? notFound();
  const teamProjects = await getTeamProjects(teamName);

  return (
    <div className="w-full flex-row relative responsive-team">
      <ProfileIcon image={teamDetail.profile_image} />
      <TeamSidebar teamDetail={teamDetail} projectCount={teamProjects.length} />
      <section className="w-full">
        <div className="pl-[3rem] pt-[4.5rem] grid grid-cols-auto-fit-card gap-6 responsive-teamProjects">
          {teamProjects.map((project) => (
            <Card
              key={project.project_id}
              id={project.project_id}
              title={project.project_name}
              description={project.description}
              ownerName={project.profile.profile_name}
              projectImage={convertFromDatabaseImageURL(
                project.project_thumbnail,
              )}
              isTeam={project.profile.is_team}
              authors={project.project_contributors.map((contributor) => ({
                name: contributor.profile.profile_name,
                profileImage: convertFromDatabaseImageURL(
                  contributor.profile.profile_image,
                ),
              }))}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Team;
