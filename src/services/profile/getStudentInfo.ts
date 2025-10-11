'use server';
import { Tables } from "@/utils/supabase/database.types";
import { createClient } from "@/utils/supabase/server"

type StudentInfo = {
  student: Pick<Tables<'student'>, 'name' | 'student_number'> & {
    departments: Pick<Tables<'departments'>, 'department_name'>
  }
}

export const getStudentInfo = async (profile_id: string): Promise<StudentInfo> => {
  const supbase = await createClient();

  const { data, error } = await supbase
    .from('profile_permission')
    .select(`
      student (
        name,
        student_number,
        departments (
          department_name
        )
      )
    `)
    .eq('profile_id', profile_id)
    .maybeSingle<StudentInfo>()

  if (!data || error) {
    throw new Error('학생 정보 조회 중 오류')
  }

  return data;
}