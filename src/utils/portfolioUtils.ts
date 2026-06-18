import { converIsTeamToUrl } from '@/utils/convertIsTeamToUrl';

// 취업 상태 상수
export const JOB_SEEKING_STATUS = ['구직 중', '구직중', '취업 희망', '취업희망'];
export const EMPLOYED_STATUS = ['취업', '재직 중', '재직중'];

/**
 * 필터 상태 타입 정의
 */
export interface FilterState {
  jobs: string[];
  departments: string[];
  showOnlyJobSeeking: boolean;
  showOnlyEmployed: boolean;
}

/**
 * 필터링 가능한 포트폴리오 아이템에 필요한 필드 접근자 인터페이스
 */
export interface PortfolioFilterAccessors<T> {
  getProfileName: (item: T) => string | null | undefined;
  getStudentName: (item: T) => string | null | undefined;
  getProjects: (item: T) => Array<{
    name?: string | null;
    description?: string | null;
  }>;
  getDepartmentName: (item: T) => string | null | undefined;
  getRoles: (item: T) => string[];
  getStatus: (item: T) => string;
}

/**
 * 포트폴리오 필터링 함수들을 생성하는 팩토리 함수
 * DRY 원칙에 따라 SearchTab과 ViewerContent에서 공통으로 사용
 * @param searchTerm - 검색어
 * @param filter - 필터 상태
 * @param accessors - 데이터 접근자 객체
 * @returns 필터링 함수들을 담은 객체
 */
export const createPortfolioFilters = <T>(
  searchTerm: string,
  filter: FilterState,
  accessors: PortfolioFilterAccessors<T>,
) => ({
  /**
   * 검색어로 필터링
   */
  filterBySearchTerm: (data: T): boolean => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const profileName = accessors.getProfileName(data);
    const studentName = accessors.getStudentName(data);
    const projects = accessors.getProjects(data);

    return (
      profileName?.toLowerCase().includes(searchLower) ||
      studentName?.toLowerCase().includes(searchLower) ||
      projects.some(
        (project) =>
          project.name?.toLowerCase().includes(searchLower) ||
          project.description?.toLowerCase().includes(searchLower),
      )
    );
  },

  /**
   * 학과로 필터링
   */
  filterByDepartments: (data: T): boolean => {
    if (filter.departments.length === 0) return true;
    const deptName = accessors.getDepartmentName(data);
    return deptName ? filter.departments.includes(deptName) : false;
  },

  /**
   * 직무로 필터링
   */
  filterByJobs: (data: T): boolean => {
    if (filter.jobs.length === 0) return true;
    return accessors.getRoles(data).some((role) => filter.jobs.includes(role));
  },

  /**
   * 취업 상태로 필터링
   */
  filterByEmploymentStatus: (data: T): boolean => {
    const { showOnlyJobSeeking, showOnlyEmployed } = filter;
    // 둘 다 선택되거나 둘 다 선택되지 않은 경우
    if (showOnlyJobSeeking === showOnlyEmployed) return true;

    const status = accessors.getStatus(data);

    if (showOnlyJobSeeking) {
      return JOB_SEEKING_STATUS.includes(status);
    }

    if (showOnlyEmployed) {
      return EMPLOYED_STATUS.includes(status);
    }

    return true;
  },
});

/**
 * 포트폴리오 데이터를 모든 필터 조건으로 필터링
 * @param data - 필터링할 포트폴리오 데이터 배열
 * @param searchTerm - 검색어
 * @param filter - 필터 상태
 * @param accessors - 데이터 접근자 객체
 * @returns 필터링된 데이터 배열
 */
export const filterPortfolioData = <T>(
  data: T[],
  searchTerm: string,
  filter: FilterState,
  accessors: PortfolioFilterAccessors<T>,
): T[] => {
  const filters = createPortfolioFilters(searchTerm, filter, accessors);
  return data
    .filter(filters.filterBySearchTerm)
    .filter(filters.filterByDepartments)
    .filter(filters.filterByJobs)
    .filter(filters.filterByEmploymentStatus);
};

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

