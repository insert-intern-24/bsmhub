'use server';
import { ProfileType } from '@/app/components/portfolio/types';
import { createClient } from "@/services/supabase/server"


export const getProfile = async (profile_name: string): Promise<ProfileType | null> => {
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
        ),
        student_jobs (
          job:jobs (
            job_name
          )
        )
      )
    `)
    .eq('profile_name', profile_name)
    .eq('is_team', false)
    .maybeSingle<ProfileType>()

  // 에러가 발생한 경우에만 에러를 던짐
  if (error) {
    console.error('학생 프로필 조회 중 오류:', error);
    throw new Error(`학생 프로필 조회 중 오류: ${error.message}`);
  }

  // 데이터가 없으면 null 반환 (maybeSingle의 정상 동작)
  return data ?? null;
}