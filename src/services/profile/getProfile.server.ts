'use server';
import { ProfileType } from "@/app/(box-layout)/portfolio/types";
import { createClient } from "@/services/supabase/server"


export const getProfile = async (profile_name: string): Promise<ProfileType> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profile')
    .select(`
      profile_id,
      profile_name,
      description,
      profile_image,
      owner,
      student!profile_owner_fkey1 (
        name,
        student_number,
        departments (
          department_name
        )
      )
    `)
    .eq('profile_name', profile_name)
    .eq('is_team', false)
    .maybeSingle<ProfileType>()

  if (!data || error) {
    throw new Error('학생 프로필 조회 중 오류');
  }

  return data;
}