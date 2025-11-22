/**
 * 학생 관련 계산 유틸리티 함수들
 * 학년, 기수, 년도 계산을 위한 공통 모듈
 */

/**
 * 현재 연도 반환
 * @returns 현재 연도 (number)
 */
export function getCurrentYear(): number {
  return new Date().getFullYear();
}

/**
 * 날짜 문자열에서 연도 추출
 * @param dateString - 날짜 문자열 (Date 생성자가 파싱 가능한 형식)
 * @returns 유효한 날짜의 경우 연도(number), 유효하지 않은 경우 -1
 */
export function extractYearFromDate(dateString: string | null): number {
  if (!dateString) return -1;

  const date = new Date(dateString);
  // 유효하지 않은 날짜인 경우 -1 반환
  if (isNaN(date.getTime())) return -1;

  return date.getFullYear();
}

/**
 * 입학년도(join_at)로 현재 학년 계산
 * 현재 연도 기준: 현재 연도 - 입학년도 + 1 = 학년
 * @param joinAt - 입학년도 날짜 문자열
 * @returns 학년 (1, 2, 3, 4), 계산 불가능한 경우 0
 */
export function calculateGradeFromJoinAt(joinAt: string | null): number {
  if (!joinAt) return 0;

  const joinYear = extractYearFromDate(joinAt);
  if (joinYear === -1) return 0;

  const currentYear = getCurrentYear();
  const grade = currentYear - joinYear + 1;

  // 학년은 1~4학년 범위로 제한 (일반적인 대학 학제 기준)
  if (grade < 1) return 0;
  if (grade > 4) return 0; // 졸업생도 0으로 처리

  return grade;
}

/**
 * 학번에서 학년 추출
 * 학번 형식: 0000 (첫 번째 자리수가 학년)
 * @param studentNumber - 학번 (number)
 * @returns 학년 (1, 2, 3, 4), 계산 불가능한 경우 0
 */
export function calculateGradeFromStudentNumber(
  studentNumber: number | null,
): number {
  if (!studentNumber) return 0;

  const studentNumberStr = studentNumber.toString();
  if (studentNumberStr.length < 1) return 0;

  const grade = parseInt(studentNumberStr[0], 10);
  if (isNaN(grade) || grade < 1 || grade > 4) return 0;

  return grade;
}

/**
 * 기수 계산
 * 현재 연도 기준: 현재 연도 - 창립년도 + 1 = 기수
 * @param foundedYear - 창립년도
 * @param currentYear - 현재 연도 (선택적, 기본값은 현재 연도)
 * @returns 기수 (number)
 */
export function calculateGeneration(
  foundedYear: number,
  currentYear?: number,
): number {
  const year = currentYear ?? getCurrentYear();
  return year - foundedYear + 1;
}

