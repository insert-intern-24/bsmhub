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
import ContentEditor from '@/app/components/feature/editor/ContentEditor';
import { checkProfileEditPermission } from '@/services/profile/checkProfileEditPermission.server';

// 날짜 정보가 없는 프로젝트를 나타내는 상수
const UNKNOWN_DATE_YEAR = -1;

const Team = async ({
  teamName,
  path = 'home',
}: {
  teamName: string;
  path?: 'home' | 'project';
}) => {
  const teamDetail = (await getTeamData(teamName)) ?? notFound();
  const teamProjects = await getTeamProjects(teamName);
  
  // Check edit permission for team
  const hasEditPermission = await checkProfileEditPermission(teamDetail.profile_id);

  const projectsByYear = teamProjects.reduce(
    (acc, project) => {
      const year = getFoundedYear(project.created_at ?? null);
      (acc[year] ??= []).push(project);
      return acc;
    },
    {} as Record<number, typeof teamProjects>,
  );

  const sortedYears = Object.keys(projectsByYear)
    .map(Number)
    .sort((a, b) => {
      // "날짜 미상"은 항상 마지막에 표시
      if (a === UNKNOWN_DATE_YEAR) return 1;
      if (b === UNKNOWN_DATE_YEAR) return -1;
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
          
          {/* HTML Description Section */}
          <ContentEditor
            contentType="profile"
            id={teamDetail.profile_id}
            initialHtmlContent={teamDetail.profile_html_description?.html_content}
            hasEditPermission={hasEditPermission}
          />
          
          {path === 'home' ? (
            <ProjectGrid projects={teamProjects} className="mt-6" isTeamProject={true} />
          ) : (
            <div className="w-full flex flex-col gap-8 mt-6">
              {sortedYears.map((year) => (
                <div key={year} className="w-full flex flex-col gap-4">
                  <Title>{year === UNKNOWN_DATE_YEAR ? '날짜 미상' : `${year}년`}</Title>
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
