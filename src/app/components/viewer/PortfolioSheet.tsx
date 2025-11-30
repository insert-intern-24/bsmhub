import { Label, Title, Body } from '@/app/components/ui/text/text';
import React from 'react';
import Link from 'next/link';
import ProfileImage from '@/app/components/ui/profile/ProfileImage';
import BulletList from '@/app/components/viewer/BulletList';
import Section from '@/app/components/viewer/Section';
import { ViewerPortfolioData } from '@/services/portfolio/getAllViewerPortfolioData.server';
import { calculateGradeFromStudentNumber } from '@/utils/student/studentCalculations';
import { converIsTeamToUrl } from '@/utils/convertIsTeamToUrl';

interface PortfolioSheetProps {
  data: ViewerPortfolioData;
}

// 유틸리티 함수들
const getNotNull = <T,>(value: T | null | undefined, fallback = ''): T | string =>
  value ?? fallback;

const joinNames = (items: Array<{ [key: string]: string | null }>, key: string): string =>
  items
    .map((item) => item[key])
    .filter((name): name is string => name !== null && name !== undefined)
    .join(', ');

const createProjectLink = (
  ownerProfileName: string | null,
  ownerIsTeam: boolean | null,
  projectName: string,
): string | undefined =>
  ownerProfileName && projectName
    ? `/${converIsTeamToUrl(ownerIsTeam ?? false)}/${ownerProfileName}/${projectName}`
    : undefined;

const PortfolioSheet = ({ data }: PortfolioSheetProps) => {
  const { profile, student, department, jobs, skills, competitions, projects } = data;

  const grade = student?.student_number
    ? calculateGradeFromStudentNumber(student.student_number)
    : 0;
  const departmentName = getNotNull(department?.department_name);
  const topLabelText = grade > 0 && departmentName ? `${grade}학년 ${departmentName}` : departmentName;

  const jobNames = joinNames(jobs, 'job_name');
  const skillNames = joinNames(skills, 'skill_name');

  const competitionItems = competitions
    .filter((comp) => comp.competition_name && comp.prize)
    .map((comp) => ({ text: `${comp.competition_name} ${comp.prize}` }));

  const projectItems = projects
    .filter((proj) => proj.project_name)
    .map((proj) => {
      const projectName = proj.project_name!;
      const text = proj.description ? `${projectName} : ${proj.description}` : projectName;
      return {
        text,
        href: createProjectLink(proj.owner_profile_name, proj.owner_is_team, projectName),
      };
    });

  return (
    <article className="flex-col gap-[24px] w-full">
      {/* 상단 라벨 */}
      {topLabelText && (
        <Label className="text-blue-secondary font-light">
          {topLabelText}
        </Label>
      )}

      {/* 프로필 섹션 */}
      <div className="flex-col gap-[22px] w-full">
        {/* 프로필 정보 */}
        <div className="flex-center gap-[20px] w-full">
          {/* 프로필 이미지 */}
          <div className="h-[213px] w-[166px] shrink-0">
            <ProfileImage
              src={profile.profile_image}
              name={student?.name || ''}
              size={{ width: 166, height: 213 }}
              shape="square"
              className="w-full h-full"
            />
          </div>

          {/* 프로필 텍스트 정보 */}
          <div className="flex-col h-[213px] justify-between shrink-0 flex-1">
            <div className="flex-col gap-[7px] w-full">
              {student?.name && profile.profile_name && (
                <Link href={`/portfolio/${encodeURIComponent(profile.profile_name)}`}>
                  <Title className="text-black cursor-pointer hover:underline">
                    {student.name}
                  </Title>
                </Link>
              )}
              {!profile.profile_name && student?.name && (
                <Title className="text-black">{student.name}</Title>
              )}
              {profile.email && <Body className="text-black">{profile.email}</Body>}
              {profile.description && (
                <Body className="text-blue-secondary whitespace-pre-line">
                  {profile.description}
                </Body>
              )}
            </div>

            {jobNames && (
              <div className="flex-col gap-[3px]">
                <Label className="text-blue-secondary">희망 취업 분야</Label>
                <Body className="text-black">{jobNames}</Body>
              </div>
            )}
          </div>
        </div>

        {/* 상세 정보 섹션들 */}
        <div className="flex-col gap-10 w-full">
          {/* 언어/기술/스택 */}
          {skillNames && (
            <Section title="언어/기술/스택">
              <Body className="text-black">{skillNames}</Body>
            </Section>
          )}

          {/* 수상경력 */}
          {competitionItems.length > 0 && (
            <Section title="수상경력">
              <BulletList items={competitionItems} />
            </Section>
          )}

          {/* 프로젝트 및 경험 */}
          {projectItems.length > 0 && (
            <Section title="프로젝트 및 경험">
              <BulletList items={projectItems} />
            </Section>
          )}
        </div>
      </div>
    </article>
  );
};

export default PortfolioSheet;
