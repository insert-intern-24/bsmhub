import { calculateGradeFromStudentNumber } from './student/studentCalculations';

// 0000 형식의 학번을 '0학년 0반' 형식으로 바꿔주는 함수
export const convertStudentNumber = (student_number: number | null): string => {
  if (!student_number) return '';

  const studentNumber = student_number.toString();
  const grade = calculateGradeFromStudentNumber(student_number);

  return `${grade}학년 ${studentNumber[1] || ''}반`;
};