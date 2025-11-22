import { CardProps } from '@/app/components/card/project/ProjectCard';
import {
  calculateGradeFromJoinAt,
  extractYearFromDate,
  getCurrentYear,
} from '@/utils/student/studentCalculations';

/**
 * 프로젝트 정렬을 위한 추가 데이터 타입
 */
export interface ProjectSortData {
  projectId: number;
  isTeam: boolean;
  joinAt?: string | null; // 학생의 입학년도 (개인 프로젝트용)
  createdAt?: string | null; // 프로젝트 생성년도 (팀 프로젝트용)
  hasHtmlDescription: boolean; // HTML 설명 유무
}

/**
 * 프로젝트의 학년을 계산
 * @param project - CardProps
 * @param sortData - 정렬을 위한 추가 데이터
 * @returns 학년 (1, 2, 3, 4), 계산 불가능한 경우 0
 */
function calculateProjectGrade(
  project: CardProps,
  sortData: ProjectSortData | undefined,
): number {
  if (!sortData) return 0;

  // 팀 프로젝트: 프로젝트 생성년도로 계산
  if (project.isTeam && sortData.createdAt) {
    const createdYear = extractYearFromDate(sortData.createdAt);
    if (createdYear === -1) return 0;

    const currentYear = getCurrentYear();
    const grade = currentYear - createdYear + 1;

    // 학년 범위 제한 (1~3학년)
    return grade >= 1 && grade <= 3 ? grade : 0;
  }

  // 개인 프로젝트: 학생의 입학년도로 계산
  if (!project.isTeam && sortData.joinAt) {
    const grade = calculateGradeFromJoinAt(sortData.joinAt);
    return grade >= 1 && grade <= 3 ? grade : 0;
  }
  return 0;
}

/**
 * 프로젝트에 실제 썸네일이 있는지 확인
 * 기본 썸네일 URL은 썸네일이 없는 것으로 처리
 * @param projectImage - 프로젝트 이미지 URL
 * @returns 실제 썸네일이 있으면 true, 없으면 false
 */
function hasRealThumbnail(projectImage: string | undefined): boolean {
  if (!projectImage || projectImage.trim() === '') return false;

  // 기본 썸네일 URL은 썸네일이 없는 것으로 처리
  return !projectImage.includes('project_default_thumbnail');
}

/**
 * 프로젝트를 썸네일 유무, HTML 설명 유무, 학년 기준으로 정렬
 * 정렬 우선순위:
 * 1. 썸네일 유무 (썸네일이 있는 프로젝트가 위로)
 * 2. HTML 설명 유무 (HTML 설명이 있는 프로젝트가 위로)
 * 3. 학년 (3학년 > 2학년 > 1학년 > 0)
 *
 * @param projects - 정렬할 프로젝트 배열
 * @param sortDataMap - 프로젝트 ID를 키로 하는 정렬 데이터 맵
 * @returns 정렬된 프로젝트 배열
 */
export function sortProjectsByThumbnailAndGrade(
  projects: CardProps[],
  sortDataMap: Map<number, ProjectSortData>,
): CardProps[] {
  return [...projects].sort((a, b) => {
    const sortDataA = sortDataMap.get(a.id);
    const sortDataB = sortDataMap.get(b.id);

    // 1순위: 썸네일 유무
    const hasThumbnailA = hasRealThumbnail(a.projectImage);
    const hasThumbnailB = hasRealThumbnail(b.projectImage);

    if (hasThumbnailA !== hasThumbnailB) {
      // 썸네일이 있는 프로젝트가 위로
      return hasThumbnailA ? -1 : 1;
    }

    // 2순위: HTML 설명 유무
    const hasHtmlDescA = sortDataA?.hasHtmlDescription ?? false;
    const hasHtmlDescB = sortDataB?.hasHtmlDescription ?? false;

    if (hasHtmlDescA !== hasHtmlDescB) {
      // HTML 설명이 있는 프로젝트가 위로
      return hasHtmlDescA ? -1 : 1;
    }

    // 3순위: 학년별 정렬 (3학년 > 2학년 > 1학년 > 0)
    const gradeA = calculateProjectGrade(a, sortDataA);
    const gradeB = calculateProjectGrade(b, sortDataB);

    // 학년이 높은 순서대로 (3 > 2 > 1 > 0)
    return gradeB - gradeA;
  });
}

