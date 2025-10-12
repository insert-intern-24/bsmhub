'use server';
import { ProfileType } from "@/app/portfolio/types";
import { createClient } from "@/utils/supabase/server"


export const getProfile = async (profile_name: string): Promise<ProfileType> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profile')
    .select(`
      profile_id,
      profile_name,
      description,
      profile_image,
      profile_permission (
        student (
          name,
          student_number,
          departments (
            department_name
          )
        )
      )
    `)
    .eq('profile_name', profile_name)
    .eq('is_team', false)
    .maybeSingle<ProfileType>()

  if (!data || error) {
    throw new Error('학생 정보 조회 중 오류')
  }

  return data;
}