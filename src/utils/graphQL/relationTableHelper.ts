import { createClient } from '@/utils/supabase/client';
import { Tables } from '../supabase/database.types';

/**
 * skill_name으로 skill_id를 찾거나 새로 생성합니다.
 */
export async function getOrCreateSkillId(skillName: string): Promise<number> {
  if (!skillName) {
    throw new Error('Skill name cannot be empty.');
  }

  const supabase = createClient();

  const { data: existingSkill } = await supabase
    .from('skills')
    .select('skill_id')
    .eq('skill_name', skillName)
    .maybeSingle<Tables<'skills'>>();

  if (existingSkill) {
    return existingSkill.skill_id;
  }

  const { data: newSkill, error } = await supabase
    .from('skills')
    .insert({ skill_name: skillName, language: false } as never)
    .select('skill_id')
    .single<Tables<'skills'>>();

  if (error) {
    console.error('Error creating new skill:', error);
    throw error;
  }
  if (newSkill) {
    return newSkill.skill_id;
  }

  throw new Error('Failed to get or create skill ID.');
}

/**
 * certificate_name을 certificate_id로 변환 (없으면 생성)
 */
export async function getOrCreateCertificateIds(
  certificateNames: string[],
): Promise<number[]> {
  if (certificateNames.length === 0) return [];

  const supabase = createClient();
  const certificateIds: number[] = [];

  for (const certificateName of certificateNames) {
    const { data: existingCert } = await supabase
      .from('certificates')
      .select('certificate_id')
      .eq('certificate_name', certificateName)
      .maybeSingle();

    if (existingCert) {
      certificateIds.push(
        (existingCert as { certificate_id: number }).certificate_id,
      );
    } else {
      const { data: newCert } = await supabase
        .from('certificates')
        .insert({ certificate_name: certificateName } as never)
        .select('certificate_id')
        .single();

      if (newCert) {
        certificateIds.push(
          (newCert as { certificate_id: number }).certificate_id,
        );
      }
    }
  }

  return certificateIds;
}

/**
 * prize를 competition_id로 변환 (없으면 생성)
 */
export async function getOrCreateCompetitionIds(
  prizes: string[],
): Promise<number[]> {
  if (prizes.length === 0) return [];

  const supabase = createClient();
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

/**
 * profile_skills 테이블 업데이트 (ID 기반)
 * @param profileId - 프로필 ID
 * @param skillIds - 새로운 스킬 ID 배열
 * @param existingProfileSkills - 기존 프로필 스킬 데이터 배열
 */
export async function updateProfileSkills(
  profileId: string,
  skillIds: number[],
  existingProfileSkills: Array<{ skill_id: number }> = [],
): Promise<void> {
  const supabase = createClient();

  const existingSkillIds = new Set(
    existingProfileSkills.map((s) => s.skill_id),
  );
  const newSkillIds = new Set(skillIds);

  // 삭제할 스킬 ID 찾기
  const skillsToDelete = Array.from(existingSkillIds).filter(
    (id) => !newSkillIds.has(id),
  );

  // 삭제 실행
  if (skillsToDelete.length > 0) {
    for (const skillId of skillsToDelete) {
      await supabase
        .from('profile_skills')
        .delete()
        .eq('profile_id', profileId)
        .eq('skill_id', skillId);
    }
  }

  // 추가할 스킬 ID 찾기
  const skillsToAdd = skillIds.filter((id) => !existingSkillIds.has(id));

  // 추가 실행
  if (skillsToAdd.length > 0) {
    const skillPayloads = skillsToAdd.map((skillId) => ({
      skill_id: skillId,
      profile_id: profileId,
    }));
    await supabase.from('profile_skills').insert(skillPayloads as never);
  }
}

/**
 * student_certificates 테이블 업데이트 (개별 삭제 + upsert)
 * @param studentId - 학생 ID
 * @param certificateNames - 새로운 자격증 이름 배열
 * @param existingCerts - 기존 자격증 데이터 배열 (캐시된 데이터, certificate_id 포함)
 */
export async function updateStudentCertificates(
  studentId: string,
  certificateNames: string[],
  existingCerts: Array<{
    certificate_id: number;
    certificate_name: string;
  }> = [],
): Promise<void> {
  const supabase = createClient();

  const existingCertNames = new Set(
    existingCerts.map((c) => c.certificate_name),
  );
  const newCertNames = new Set(certificateNames);

  // 2. 삭제할 항목 찾기
  const certsToDelete = existingCerts.filter(
    (cert) => !newCertNames.has(cert.certificate_name),
  );

  // 3. 개별 삭제 - certificate_id를 이미 알고 있음
  for (const cert of certsToDelete) {
    await supabase
      .from('student_certificates')
      .delete()
      .eq('student_id', studentId)
      .eq('certificate_id', cert.certificate_id);
  }

  // 4. 추가할 항목 찾기
  const certsToAdd = certificateNames.filter(
    (name) => !existingCertNames.has(name),
  );

  // 5. 새 항목 삽입
  if (certsToAdd.length > 0) {
    const certificateIds = await getOrCreateCertificateIds(certsToAdd);
    if (certificateIds.length > 0) {
      const certPayloads = certificateIds.map((certId) => ({
        certificate_id: certId,
        student_id: studentId,
      }));
      await supabase.from('student_certificates').insert(certPayloads as never);
    }
  }
}

/**
 * profile_competitions 테이블 업데이트 (개별 삭제 + upsert)
 * @param profileId - 프로필 ID
 * @param prizes - 새로운 수상 이력 배열
 * @param existingComps - 기존 수상 이력 데이터 배열 (캐시된 데이터, competition_id 포함)
 */
export async function updateProfileCompetitions(
  profileId: string,
  prizes: string[],
  existingComps: Array<{ competition_id: number; prize: string }> = [],
): Promise<void> {
  const supabase = createClient();

  const existingPrizes = new Set(existingComps.map((c) => c.prize));
  const newPrizes = new Set(prizes);

  // 2. 삭제할 항목 찾기
  const compsToDelete = existingComps.filter(
    (comp) => !newPrizes.has(comp.prize),
  );

  // 3. 개별 삭제 - competition_id를 이미 알고 있음
  for (const comp of compsToDelete) {
    await supabase
      .from('profile_competitions')
      .delete()
      .eq('profile_id', profileId)
      .eq('competition_id', comp.competition_id);
  }

  // 4. 추가할 항목 찾기
  const prizesToAdd = prizes.filter((prize) => !existingPrizes.has(prize));

  // 5. 새 항목 삽입
  if (prizesToAdd.length > 0) {
    const competitionIds = await getOrCreateCompetitionIds(prizesToAdd);
    if (competitionIds.length > 0) {
      const compPayloads = competitionIds.map((compId, index) => ({
        competition_id: compId,
        prize: prizesToAdd[index],
        profile_id: profileId,
      }));
      await supabase.from('profile_competitions').insert(compPayloads as never);
    }
  }
}