'use client';

import { createClient } from '@/services/supabase/client';
import { Tables } from '@/services/supabase/database.types';

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

// 사용자가 선택 가능한 프로필 목록 조회 (개인 + 속한 팀)
export interface SelectableProfile {
  profile_id: string;
  profile_name: string;
  profile_image: string;
  is_team: boolean;
}

export const getSelectableProfilesByStudentId = async (
  studentId: string,
): Promise<SelectableProfile[]> => {
  const supabase = createClient();

  try {
    // 1. 개인 프로필 조회
    const { data: personalProfile, error: personalError } = await supabase
      .from('profile')
      .select('profile_id, profile_name, profile_image, is_team')
      .eq('owner', studentId)
      .eq('is_team', false)
      .maybeSingle<SelectableProfile>();

    if (personalError) {
      console.error('Error fetching personal profile:', personalError);
      return [];
    }

    if (!personalProfile) {
      return [];
    }

    // 2. team_member 테이블에서 사용자가 속한 팀 ID 조회
    const { data: teamMemberships, error: teamMemberError } = await supabase
      .from('team_member')
      .select('profile_id')
      .eq('participant_id', personalProfile.profile_id)
      .returns<{ profile_id: string }[]>();

    if (teamMemberError) {
      console.error('Error fetching team memberships:', teamMemberError);
      // 개인 프로필만 반환
      return [personalProfile];
    }

    // 3. 속한 팀이 없으면 개인 프로필만 반환
    if (!teamMemberships || teamMemberships.length === 0) {
      return [personalProfile];
    }

    // 4. 팀 프로필 정보 조회
    const teamIds = teamMemberships.map((tm) => tm.profile_id);
    const { data: teamProfiles, error: teamProfileError } = await supabase
      .from('profile')
      .select('profile_id, profile_name, profile_image, is_team')
      .eq('is_team', true)
      .in('profile_id', teamIds);

    if (teamProfileError) {
      console.error('Error fetching team profiles:', teamProfileError);
      return [personalProfile];
    }

    // 5. 개인 프로필 + 팀 프로필 반환
    return [personalProfile, ...(teamProfiles || [])];
  } catch (error) {
    console.error('Unexpected error in getSelectableProfilesByStudentId:', error);
    return [];
  }
};

// profile_id로 프로필 정보 조회 함수
export const getProfileById = async (
  profileId: string,
): Promise<{ profile_name: string; is_team: boolean } | null> => {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from('profile')
      .select('profile_name, is_team')
      .eq('profile_id', profileId)
      .maybeSingle<{ profile_name: string; is_team: boolean }>();

    if (error) {
      console.error('Error fetching profile by ID:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error in getProfileById:', error);
    return null;
  }
};
