export const convertStudentNumber = (student_number: number | null): string => {
  if (!student_number) return '';

  const studentNumber = student_number.toString();

  return `${studentNumber[0]}학년 ${studentNumber[1]}반`
}