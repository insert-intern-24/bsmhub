import { createClient } from '@/utils/supabase/client';

/**
 * skill_name을 skill_id로 변환 (없으면 생성)
 */
export async function getOrCreateSkillIds(
  skillNames: string[],
): Promise<number[]> {
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
      const { data: newSkill } = await supabase
        .from('skills')
        .insert({ skill_name: skillName, language: false } as never)
        .select('skill_id')
        .single();

      if (newSkill) {
        skillIds.push((newSkill as { skill_id: number }).skill_id);
      }
    }
  }

  return skillIds;
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
 * profile_skills 테이블 업데이트 (삭제 후 삽입)
 */
export async function updateProfileSkills(
  profileId: string,
  skillNames: string[],
): Promise<void> {
  const supabase = createClient();

  // 1. 기존 데이터 삭제
  await supabase.from('profile_skills').delete().eq('profile_id', profileId);

  // 2. 새 데이터 삽입
  if (skillNames.length > 0) {
    const skillIds = await getOrCreateSkillIds(skillNames);
    if (skillIds.length > 0) {
      const skillPayloads = skillIds.map((skillId) => ({
        skill_id: skillId,
        profile_id: profileId,
      }));
      await supabase.from('profile_skills').insert(skillPayloads as never);
    }
  }
}

/**
 * student_certificates 테이블 업데이트 (삭제 후 삽입)
 */
export async function updateStudentCertificates(
  studentId: string,
  certificateNames: string[],
): Promise<void> {
  const supabase = createClient();

  // 1. 기존 데이터 삭제
  await supabase
    .from('student_certificates')
    .delete()
    .eq('student_id', studentId);

  // 2. 새 데이터 삽입
  if (certificateNames.length > 0) {
    const certificateIds = await getOrCreateCertificateIds(certificateNames);
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
 * profile_competitions 테이블 업데이트 (삭제 후 삽입)
 */
export async function updateProfileCompetitions(
  profileId: string,
  prizes: string[],
): Promise<void> {
  const supabase = createClient();

  // 1. 기존 데이터 삭제
  await supabase
    .from('profile_competitions')
    .delete()
    .eq('profile_id', profileId);

  // 2. 새 데이터 삽입
  if (prizes.length > 0) {
    const competitionIds = await getOrCreateCompetitionIds(prizes);
    if (competitionIds.length > 0) {
      const compPayloads = competitionIds.map((compId, index) => ({
        competition_id: compId,
        prize: prizes[index],
        profile_id: profileId,
      }));
      await supabase.from('profile_competitions').insert(compPayloads as never);
    }
  }
}
