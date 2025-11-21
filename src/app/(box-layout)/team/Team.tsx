'use server';
import { getTeamData } from '@/services/team/getTeamData.server';
import { getTeamProjects } from '@/services/team/getTeamProjects.server';
import { notFound } from 'next/navigation';
import TeamSidebar from '@/app/components/section/team/TeamSidebar';
import ProfileIcon from '@/app/components/ui/profile/ProfileIcon';
import ProjectGrid from '@/app/components/feature/project/components/ProjectGrid';
import SidebarContentLayout from '@/app/components/layout/sidebar/SidebarContentLayout';
import Tabs from '@/app/components/layout/tabs/Tabs';
import { Title } from '@/app/components/ui/text/text';
import { getFoundedYear } from '@/utils/date';

const Team = async ({
  teamName,
  path = 'home',
}: {
  teamName: string;
  path?: 'home' | 'project';
}) => {
  const teamDetail = (await getTeamData(teamName)) ?? notFound();
  const teamProjects = await getTeamProjects(teamName);

  const projectsByYear = teamProjects.reduce(
    (acc, project) => {
      const year = project.created_at ? getFoundedYear(project.created_at) : -1;
      (acc[year] ??= []).push(project);
      return acc;
    },
    {} as Record<number, typeof teamProjects>,
  );

  const sortedYears = Object.keys(projectsByYear)
    .map(Number)
    .sort((a, b) => {
      // "날짜 미상" (-1)은 항상 마지막에 표시
      if (a === -1) return 1;
      if (b === -1) return -1;
      return b - a; // 최신 년도부터 내림차순
    });

  return (
    <div className="w-full relative responsive-team">
      <ProfileIcon image={teamDetail.profile_image} />
      <SidebarContentLayout
        sidebar={
          <TeamSidebar teamDetail={teamDetail} projectCount={teamProjects.length} />
        }
      >
        <section className="w-full pl-[3rem] pt-[4.5rem] responsive-teamProjects">
          <div className="mb-6">
            <Tabs tabs={['home', 'project']} />
          </div>
          {path === 'home' ? (
            <ProjectGrid projects={teamProjects} className="" isTeamProject={true} />
          ) : (
            <div className="w-full flex flex-col gap-8">
              {sortedYears.map((year) => (
                <div key={year} className="w-full flex flex-col gap-4">
                  <Title>{year === -1 ? '날짜 미상' : `${year}년`}</Title>
                  <ProjectGrid
                    projects={projectsByYear[year]}
                    isTeamProject={true}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </SidebarContentLayout>
    </div>
  );
};

export default Team;
