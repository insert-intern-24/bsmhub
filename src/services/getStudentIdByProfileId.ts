'use server';
import { createClient } from "@/utils/supabase/server";

export const getStudentIdByProfileId = async (profile_id: string): Promise<string | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('student')
    .select('student_id')
    .eq('profile_id', profile_id)
    .maybeSingle();
  
  if (error) {
    console.error('학생 ID 조회 중 오류')
    return null;
  }

  return data?.student_id || null;
}