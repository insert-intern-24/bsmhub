import { converIsTeamToUrl } from '@/utils/convertIsTeamToUrl';

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

