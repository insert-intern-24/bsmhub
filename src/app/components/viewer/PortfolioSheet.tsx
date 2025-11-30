import { Label, Title, Body } from '@/app/components/ui/text/text';
import React from 'react';
import ProfileImage from '@/app/components/ui/profile/ProfileImage';
import BulletList from '@/app/components/viewer/BulletList';
import Section from '@/app/components/viewer/Section';
import { ViewerPortfolioData } from '@/services/portfolio/getAllViewerPortfolioData.server';
import { calculateGradeFromStudentNumber } from '@/utils/student/studentCalculations';

interface PortfolioSheetProps {
  data: ViewerPortfolioData;
}

const PortfolioSheet = ({ data }: PortfolioSheetProps) => {
  const { profile, student, department, jobs, skills, competitions, projects } = data;

  // 학년 계산
  const grade = student?.student_number
    ? calculateGradeFromStudentNumber(student.student_number)
    : 0;

  // 학과명
  const departmentName = department?.department_name || '';

  // 상단 라벨 텍스트 생성
  const topLabelText =
    grade > 0 && departmentName
      ? `${grade}학년 ${departmentName}`
      : departmentName || '';

  // 학생 이름
  const studentName = student?.name || '';

  // 이메일
  const email = profile.email || '';

  // 자기소개
  const bio = profile.description || '';

  // 희망 취업 분야
  const jobNames = jobs
    .map((job) => job.job_name)
    .filter((name): name is string => name !== null)
    .join(', ');

  // 기술 스택
  const skillNames = skills
    .map((skill) => skill.skill_name)
    .filter((name): name is string => name !== null)
    .join(', ');

  // 수상경력 리스트
  const competitionItems = competitions
    .filter(
      (comp) =>
        comp.competition_name !== null &&
        comp.competition_name !== undefined &&
        comp.prize !== null &&
        comp.prize !== undefined,
    )
    .map((comp) => ({
      text: `${comp.competition_name} ${comp.prize}`,
    }));

  // 프로젝트 리스트
  const projectItems = projects
    .filter(
      (proj) =>
        proj.project_name !== null && proj.project_name !== undefined,
    )
    .map((proj) => ({
      text: proj.description
        ? `${proj.project_name} : ${proj.description}`
        : proj.project_name || '',
    }));

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
              name={studentName}
              size={{ width: 166, height: 213 }}
              shape="square"
              className="w-full h-full"
            />
          </div>

          {/* 프로필 텍스트 정보 */}
          <div className="flex-col h-[213px] justify-between shrink-0 flex-1">
            <div className="flex-col gap-[7px] w-full">
              {studentName && <Title className="text-black">{studentName}</Title>}
              {email && <Body className="text-black">{email}</Body>}
              {bio && (
                <Body className="text-blue-secondary whitespace-pre-line">
                  {bio}
                </Body>
              )}
            </div>

            {/* 희망 취업 분야 */}
            {jobNames && (
              <div className="flex-col gap-[3px]">
                <Label className="text-blue-secondary">희망 취업 분야</Label>
                <Body className="text-black">{jobNames}</Body>
              </div>
            )}
          </div>
        </div>

        {/* 상세 정보 섹션들 */}
        <div className="flex-col gap-[40px] w-full">
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
