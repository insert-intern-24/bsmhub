'use server';
import Image from 'next/image';
import { getTeamDetail } from '@/services/server/team/getTeamData';
import { getTeamProjects } from '@/services/server/team/getTeamProjects';
import { convertFromDatabaseImageURL } from '@/utils/supabase/imageHostConverter';
import { notFound } from 'next/navigation';
import TeamSidebar from './TeamSidebar';
import Card from '../components/card/project/ProjectCard';

const Team = async ({ teamName }: { teamName: string }) => {
  const teamDetail = (await getTeamDetail(teamName)) ?? notFound();
  const teamProjects = await getTeamProjects(teamName);

  return (
    <div className="w-full flex-row relative responsive-team">
      <Image
        width={(120 / 16) * 14}
        height={(120 / 16) * 14}
        alt="프로필 사진"
        src={convertFromDatabaseImageURL(teamDetail?.profile_image)}
        className="rounded-sm absolute -top-20"
      />
      <TeamSidebar teamDetail={teamDetail} projectCount={teamProjects.length} />
      <section className="w-full">
        <div className="px-[3.5rem] pt-[4.5rem] grid grid-cols-auto-fit-card gap-6 responsive-teamProjects">
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
