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
      profile_skills(*),
      profile_competitions(*),
      student(*)
    `)
    .eq('owner', userId)
    .eq('is_team', false)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching profile with details:', error);
    return null;
  }
  return data;
};
