import { converIsTeamToUrl } from '@/utils/convertIsTeamToUrl';

/**
 * 데이터 배열에서 고유한 학과 목록을 추출하는 유틸리티 함수
 * DRY 원칙에 따라 SearchTab과 ViewerContent에서 공통으로 사용
 * @param data - 학과 정보를 포함한 데이터 배열
 * @param getDepartmentName - 각 아이템에서 학과 이름을 추출하는 함수
 * @returns 중복 제거 및 정렬된 학과 이름 배열
 */
export const extractUniqueDepartments = <T,>(
  data: T[],
  getDepartmentName: (item: T) => string | null | undefined,
): string[] => {
  const deptSet = new Set<string>();
  data.forEach((item) => {
    const deptName = getDepartmentName(item);
    if (deptName) {
      deptSet.add(deptName);
    }
  });
  return Array.from(deptSet).sort((a, b) => a.localeCompare(b, 'ko'));
};

/**
 * null 또는 undefined 값을 fallback 값으로 대체하는 유틸리티 함수
 * @param value - 체크할 값
 * @param fallback - value가 null/undefined일 때 반환할 기본값 (기본값: '')
 * @returns value가 존재하면 value, 아니면 fallback
 */
export const getNotNull = <T,>(value: T | null | undefined, fallback = ''): T | string =>
  value ?? fallback;

/**
 * 객체 배열에서 특정 키의 값들을 쉼표로 구분된 문자열로 조인하는 유틸리티 함수
 * @param items - 객체 배열
 * @param key - 조인할 키 이름
 * @returns null/undefined가 아닌 값들을 쉼표로 구분한 문자열
 */
export const joinNames = (items: Array<{ [key: string]: string | null }>, key: string): string =>
  items
    .map((item) => item[key])
    .filter((name): name is string => name !== null && name !== undefined)
    .join(', ');

/**
 * 프로젝트 상세 페이지 링크를 생성하는 유틸리티 함수
 * @param ownerProfileName - 프로젝트 소유자의 프로필 이름
 * @param ownerIsTeam - 프로젝트 소유자가 팀인지 여부
 * @param projectName - 프로젝트 이름
 * @returns 프로젝트 상세 페이지 URL 또는 undefined
 */
export const createProjectLink = (
  ownerProfileName: string | null,
  ownerIsTeam: boolean | null,
  projectName: string,
): string | undefined =>
  ownerProfileName && projectName
    ? `/${converIsTeamToUrl(ownerIsTeam ?? false)}/${ownerProfileName}/${projectName}`
    : undefined;

