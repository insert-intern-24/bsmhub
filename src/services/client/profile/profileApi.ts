'use client';

import { createClient } from '@/utils/supabase/client';
import { Tables } from '@/utils/supabase/database.types';

// 프로필 존재 여부 확인 함수
export const checkProfileExistence = async (
  userId: string,
): Promise<boolean> => {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from('profile')
      .select('profile_id')
      .eq('owner', userId)
      .eq('is_team', false)
      .single();
    if (error) {
      console.error('Profile existence check error:', error);
      return false;
    }

    return !!data;
  } catch {
    return false;
  }
};

export const getProfileByStudentId = async (studentId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .eq('owner', studentId)
    .eq('is_team', false)
    .maybeSingle<Tables<'profile'>>();

  if (error) {
    console.error('Error fetching profile for studentId:', studentId, error);
    return null;
  }

  return data;
};

export const getProfileWithDetails = async (userId: string) => {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('profile')
    .select(`
      *,
      profile_link(*),
      profile_skills(
        skill_id,
        skills(skill_name)
      ),
      profile_competitions(*),
      student(*,
        student_certificates(
          certificate_id,
          certificates(
            certificate_name,
            is_software
          )
        )
      )
    `)
    .eq('owner', userId)
    .eq('is_team', false)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching profile with details:', error);
    return null;
  }
  
  // 데이터 구조 평면화: student_certificates를 최상위로 이동
  if (
    data &&
    (data as unknown as { student?: Array<{ student_certificates?: unknown[] }> })
      .student &&
    (data as unknown as { student: unknown[] }).student.length > 0
  ) {
    const studentArr = (data as unknown as {
      student: Array<{ student_certificates?: unknown[] }>;
    }).student;
    (data as Record<string, unknown>).student_certificates =
      studentArr[0].student_certificates || [];
  }
  
  return data;
};
