// 0000 형식의 학번을 '0반 0번' 형식으로 바꿔주는 함수
export const convertStudentNumber = (student_number: number | null): string => {
  if (!student_number) return '';

  const studentNumber = student_number.toString();

  return `${studentNumber[0]}학년 ${studentNumber[1]}반`
}