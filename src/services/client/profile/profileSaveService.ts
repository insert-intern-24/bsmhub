'use client';

import { createClient } from '@/utils/supabase/client';
import { Tables } from '@/utils/supabase/database.types';
import { FormConfig } from '@/app/components/modal/inputs/types/inputTypes';
import { extractColumnInfoFromFormConfig } from '@/utils/graphQL/form-config-utils';

interface ProfileLinkData {
  link: string;
  alt: string | null;
  profile_id: string;
}

interface ProfileSkillsData {
  skill_id: number;
  profile_id: string;
}

interface SkillsData {
  skill_name: string;
  language: boolean | null;
}

async function getOrCreateSkillIds(skillNames: string[]): Promise<number[]> {
  if (skillNames.length === 0) return [];
  
  const supabase = createClient();
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
        language: false 
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

export interface ProfileSaveData {
  profile: Partial<Tables<'profile'>>;
  student: Partial<Tables<'student'>>;
  profileLinks: Omit<ProfileLinkData, 'profile_id'>[];
  profileSkills: string[];
}

export function transformFormDataToSaveFormat(
  formData: Record<string, any>,
  formConfig: FormConfig,
  userId: string
): ProfileSaveData {
  const result: ProfileSaveData = {
    profile: { owner: userId },
    student: {},
    profileLinks: [],
    profileSkills: []
  };

  const columnInfoMap = extractColumnInfoFromFormConfig(formConfig);

  for (const [fieldName, value] of Object.entries(formData)) {
    const columnInfo = columnInfoMap[fieldName];
    
    if (fieldName.includes('.') && columnInfo) {
      const targetTable = columnInfo.table === 'profile' || columnInfo.table === 'profiles' 
        ? result.profile 
        : result.student;
      
      // inputList 타입 처리
      let processedValue: string = value;
      if (Array.isArray(value) && value.length > 0 && Array.isArray(value[0]) && value[0].length > 0) {
        const firstItem = value[0][0] as { value: string };
        processedValue = firstItem?.value || '';
      }
      
      (targetTable as Record<string, unknown>)[columnInfo.column] = processedValue;
    } else {
      if (fieldName === 'profile_link') {
        if (Array.isArray(value) && value.length > 0) {
          result.profileLinks = value.map((item: unknown) => {
            const linkItem = item as Array<{ value: string }>;
            return {
              link: String(linkItem[0]?.value || ''),
              alt: String(linkItem[1]?.value || '')
            };
          }).filter(link => link.link.trim() !== '');
        }
      }
      if (fieldName === 'profile_skills') {
        result.profileSkills = Array.isArray(value) ? value : [];
      }
    }
  }

  return result;
}

export async function saveProfileData(
  saveData: ProfileSaveData,
  userId: string
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
      is_team: false
    };
    
    if (existingProfile) {
      profilePayload.profile_id = (existingProfile as { profile_id: string }).profile_id;
    }
    
    const { data: profileData, error: profileError } = await supabase
      .from('profile')
      .upsert(profilePayload as never)
      .select('profile_id')
      .single();

    if (profileError) {
      if (profileError.code === '23505' && profileError.message.includes('profile_profile_name_key')) {
        return { success: false, error: '이미 사용 중인 프로필 이름입니다.' };
      }
      return { success: false, error: '프로필 저장 중 오류가 발생했습니다.' };
    }

    const profileId = (profileData as { profile_id: string }).profile_id;

    // 학생 정보 upsert
    if (Object.keys(saveData.student).length > 0) {
      const studentPayload = { 
        ...saveData.student, 
        profile_id: profileId 
      };
      await supabase.from('student').upsert(studentPayload as never);
    }

    // 링크 처리
    await supabase.from('profile_link').delete().eq('profile_id', profileId);
    if (saveData.profileLinks.length > 0) {
      const linkPayloads: ProfileLinkData[] = saveData.profileLinks.map(link => ({ 
        ...link, 
        profile_id: profileId 
      }));
      await supabase.from('profile_link').insert(linkPayloads as never);
    }
    
    // 스킬 처리
    if (saveData.profileSkills.length > 0) {
      const skillIds = await getOrCreateSkillIds(saveData.profileSkills);
      if (skillIds.length > 0) {
        const skillPayloads: ProfileSkillsData[] = skillIds.map(skillId => ({ 
          skill_id: skillId, 
          profile_id: profileId 
        }));
        await supabase.from('profile_skills').upsert(skillPayloads as never);
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Profile save error:', error);
    return { success: false, error: '예상치 못한 오류가 발생했습니다.' };
  }
}