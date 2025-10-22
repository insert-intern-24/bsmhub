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
    <div className="flex-row px-[2.75rem] relative">
      <Image
        width={(120 / 16) * 14}
        height={(120 / 16) * 14}
        alt="프로필 사진"
        src={convertFromDatabaseImageURL(teamDetail?.profile_image)}
        className="rounded-sm absolute -top-20"
      />
      <TeamSidebar teamDetail={teamDetail} />
      <section className="w-full mx-[3.5rem] mt-[4.5rem] grid grid-cols-auto-fit-card gap-6">
        {teamProjects.map((project) => (
          <Card
            key={project.project_id}
            id={project.project_id}
            title={project.description}
            projectImage={convertFromDatabaseImageURL(
              project.project_thumbnail,
            )}
            authors={project.project_contributors.map((contributor) => ({
              profileImage: convertFromDatabaseImageURL(contributor.profile.profile_image),
            }))}
          />
        ))}
      </section>
    </div>
  );
};

export default Team;
