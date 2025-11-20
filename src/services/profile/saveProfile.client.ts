'use client';

import { createClient } from '@/services/supabase/client';
import { Tables } from '@/services/supabase/database.types';
import { FormConfig } from '@/app/components/ui/input/types/inputTypes';
import { extractColumnInfoFromFormConfig } from '@/services/graphQL/form-config-utils.graphql';

interface ProfileLinkData {
  link: string;
  alt: string | null;
  profile_id: string;
}

interface ProfileSkillsData {
  skill_id: number;
  profile_id: string;
}

interface StudentCertificatesData {
  certificate_id: number;
  student_id: string;
}

interface ProfileCompetitionsData {
  competition_id: number;
  prize: string;
  profile_id: string;
}

interface SkillsData {
  skill_name: string;
  language: boolean | null;
}

type Supa = ReturnType<typeof createClient>;

async function getOrCreateSkillIds(
  skillNames: string[],
  supabase: Supa,
): Promise<number[]> {
  if (skillNames.length === 0) return [];

  const skillIds: number[] = [];

  for (const skillName of skillNames) {
    const { data: existingSkill } = await supabase
      .from('skills')
      .select('skill_id')
      .eq('skill_name', skillName)
      .maybeSingle();

    if (existingSkill) {
      skillIds.push((existingSkill as { skill_id: number }).skill_id);
    } else {
      const skillData: SkillsData = {
        skill_name: skillName,
        language: false,
      };

      const { data: newSkill } = await supabase
        .from('skills')
        .insert(skillData as never)
        .select('skill_id')
        .single();

      if (newSkill) {
        skillIds.push((newSkill as { skill_id: number }).skill_id);
      }
    }
  }

  return skillIds;
}

async function getOrCreateCertificateIds(
  certificateNames: string[],
  supabase: Supa,
): Promise<number[]> {
  if (certificateNames.length === 0) return [];

  const certificateIds: number[] = [];

  for (const certificateName of certificateNames) {
    const { data: existingCertificate } = await supabase
      .from('certificates')
      .select('certificate_id')
      .eq('certificate_name', certificateName)
      .maybeSingle();

    if (existingCertificate) {
      certificateIds.push(
        (existingCertificate as { certificate_id: number }).certificate_id,
      );
    } else {
      const certificateData = {
        certificate_name: certificateName,
        is_software: false,
      };

      const { data: newCertificate } = await supabase
        .from('certificates')
        .insert(certificateData as never)
        .select('certificate_id')
        .single();

      if (newCertificate) {
        certificateIds.push(
          (newCertificate as { certificate_id: number }).certificate_id,
        );
      }
    }
  }

  return certificateIds;
}

async function getOrCreateCompetitionIds(
  prizes: string[],
  supabase: Supa,
): Promise<number[]> {
  if (prizes.length === 0) return [];

  const competitionIds: number[] = [];

  for (const prize of prizes) {
    // 간단한 대회명 생성 (실제로는 더 정교한 로직이 필요할 수 있음)
    const competitionName = `대회 - ${prize}`;

    const { data: existingCompetition } = await supabase
      .from('competitions')
      .select('competition_id')
      .eq('competition_name', competitionName)
      .maybeSingle();

    if (existingCompetition) {
      competitionIds.push(
        (existingCompetition as { competition_id: number }).competition_id,
      );
    } else {
      const competitionData = {
        competition_name: competitionName,
        competition_duration: null,
      };

      const { data: newCompetition } = await supabase
        .from('competitions')
        .insert(competitionData as never)
        .select('competition_id')
        .single();

      if (newCompetition) {
        competitionIds.push(
          (newCompetition as { competition_id: number }).competition_id,
        );
      }
    }
  }

  return competitionIds;
}

export interface ProfileSaveData {
  profile: Partial<Tables<'profile'>>;
  student: Partial<Tables<'student'>>;
  profileLinks: Omit<ProfileLinkData, 'profile_id'>[];
  profileSkills: string[];
  studentCertificates: string[];
  profileCompetitions: string[];
}

export function transformFormDataToSaveFormat(
  formData: Record<string, unknown>,
  formConfig: FormConfig,
  userId: string,
): ProfileSaveData {
  const result: ProfileSaveData = {
    profile: { owner: userId },
    student: {},
    profileLinks: [],
    profileSkills: [],
    studentCertificates: [],
    profileCompetitions: [],
  };

  const columnInfoMap = extractColumnInfoFromFormConfig(formConfig);

  for (const [fieldName, value] of Object.entries(formData)) {
    const columnInfo = columnInfoMap[fieldName];

    // profile 또는 student 테이블의 단일 값 필드 처리
    if (
      columnInfo &&
      (columnInfo.table === 'profile' ||
        columnInfo.table === 'profiles' ||
        columnInfo.table === 'student')
    ) {
      const targetTable =
        columnInfo.table === 'profile' || columnInfo.table === 'profiles'
          ? result.profile
          : result.student;

      // inputList 타입 처리
      let processedValue: string = value as string;
      if (
        Array.isArray(value) &&
        value.length > 0 &&
        Array.isArray(value[0]) &&
        value[0].length > 0
      ) {
        const firstItem = value[0][0] as { value: string };
        processedValue = firstItem?.value || '';
      }

      (targetTable as Record<string, unknown>)[columnInfo.column] =
        processedValue;
    }
    // 관계 테이블 필드 처리
    else {
      if (fieldName === 'profile_link') {
        if (Array.isArray(value) && value.length > 0) {
          result.profileLinks = value
            .map((item: unknown) => {
              const linkItem = item as Array<{ value: string }>;
              return {
                link: String(linkItem[0]?.value || ''),
                alt: String(linkItem[1]?.value || ''),
              };
            })
            .filter((link) => link.link.trim() !== '');
        }
      }
      if (fieldName === 'profile_skills') {
        result.profileSkills = Array.isArray(value)
          ? (value as unknown[]).map(String)
          : [];
      }
      if (fieldName === 'student_certificates') {
        if (Array.isArray(value) && value.length > 0) {
          result.studentCertificates = value
            .map((item: unknown) => {
              const certItem = item as Array<{ value: string }>;
              return String(certItem[0]?.value || '');
            })
            .filter((cert) => cert.trim() !== '');
        }
      }
      if (fieldName === 'profile_competitions') {
        if (Array.isArray(value) && value.length > 0) {
          result.profileCompetitions = value
            .map((item: unknown) => {
              const compItem = item as Array<{ value: string }>;
              return String(compItem[0]?.value || '');
            })
            .filter((comp) => comp.trim() !== '');
        }
      }
    }
  }

  return result;
}

export async function saveProfileData(
  saveData: ProfileSaveData,
  userId: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  try {
    // 기존 프로필 조회
    const { data: existingProfile } = await supabase
      .from('profile')
      .select('profile_id')
      .eq('owner', userId)
      .eq('is_team', false)
      .maybeSingle();

    // 프로필 upsert
    const profilePayload = {
      ...saveData.profile,
      owner: userId,
      is_team: false,
    };

    if (existingProfile) {
      profilePayload.profile_id = (
        existingProfile as { profile_id: string }
      ).profile_id;
    }

    const { data: profileData, error: profileError } = await supabase
      .from('profile')
      .upsert(profilePayload as never)
      .select('profile_id')
      .single();

    if (profileError) {
      if (
        profileError.code === '23505' &&
        profileError.message.includes('profile_profile_name_key')
      ) {
        return { success: false, error: '이미 사용 중인 프로필 이름입니다.' };
      }
      return { success: false, error: '프로필 저장 중 오류가 발생했습니다.' };
    }

    const profileId = (profileData as { profile_id: string }).profile_id;

    // 학생 정보 upsert
    if (Object.keys(saveData.student).length > 0) {
      const studentPayload = {
        ...saveData.student,
        profile_id: profileId,
      };
      await supabase.from('student').upsert(studentPayload as never);
    }

    // 링크 처리
    await supabase.from('profile_link').delete().eq('profile_id', profileId);
    if (saveData.profileLinks.length > 0) {
      const linkPayloads: ProfileLinkData[] = saveData.profileLinks.map(
        (link) => ({
          ...link,
          profile_id: profileId,
        }),
      );
      await supabase.from('profile_link').insert(linkPayloads as never);
    }

    // 스킬 처리
    if (saveData.profileSkills.length > 0) {
      const skillIds = await getOrCreateSkillIds(
        saveData.profileSkills,
        supabase,
      );
      if (skillIds.length > 0) {
        const skillPayloads: ProfileSkillsData[] = skillIds.map((skillId) => ({
          skill_id: skillId,
          profile_id: profileId,
        }));
        await supabase.from('profile_skills').upsert(skillPayloads as never);
      }
    }

    // 자격증 처리
    if (saveData.studentCertificates.length > 0) {
      const certificateIds = await getOrCreateCertificateIds(
        saveData.studentCertificates,
        supabase,
      );
      if (certificateIds.length > 0) {
        const certificatePayloads: StudentCertificatesData[] =
          certificateIds.map((certId) => ({
            certificate_id: certId,
            student_id: userId,
          }));
        await supabase
          .from('student_certificates')
          .upsert(certificatePayloads as never);
      }
    }

    // 수상내역 처리
    if (saveData.profileCompetitions.length > 0) {
      const competitionIds = await getOrCreateCompetitionIds(
        saveData.profileCompetitions,
        supabase,
      );
      if (competitionIds.length > 0) {
        const competitionPayloads: ProfileCompetitionsData[] =
          competitionIds.map((compId, index) => ({
            competition_id: compId,
            prize: saveData.profileCompetitions[index],
            profile_id: profileId,
          }));
        await supabase
          .from('profile_competitions')
          .upsert(competitionPayloads as never);
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Profile save error:', error);
    return { success: false, error: '예상치 못한 오류가 발생했습니다.' };
  }
}
