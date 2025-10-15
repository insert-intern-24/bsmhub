'use server';
import { PortfolioDetailProps, PortfolioDetailType } from "@/app/portfolio/types";
import { createClient } from "@/utils/supabase/server"

export const getProfileDetail = async (profileName: string): Promise<PortfolioDetailProps[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profile')
    .select(`
      profile_link (
        link,
        alt
      ),
      profile_permission (
        student (
          student_certificates (
            certificates (
              certificate_id,
              certificate_name
            )
          )
        )
      ),
      profile_competitions (
        prize,
        competitions (
          competition_id,
          competition_name
        )
      ),
      profile_skills (
        skills (
          skill_id,
          skill_name
        )
      )
    `)
    .eq('profile_name', profileName)
    .maybeSingle<PortfolioDetailType>()

  if (error) {
    console.error('프로필 상세 정보 조회 중 오류', error)
    return [];
  }

  const details: PortfolioDetailProps[] = [
    {
      mode: 'link',
      datas: (data?.profile_link ?? []).map((item) => ({
        value: item?.alt,
        url: item.link
      }))
    },
    {
      mode: 'certificate',
      datas: (data?.profile_permission[0].student.student_certificates ?? []).map((item) => ({
        value: item.certificates.certificate_name
      }))
    },
    {
      mode: 'competition',
      datas: (data?.profile_competitions ?? []).map((item) => ({
        value: item.competitions.competition_name,
        prize: item.prize
      }))
    },
    {
      mode: 'skill',
      datas: (data?.profile_skills ?? []).map((item) => ({
        value: item.skills.skill_name
      }))
    }
  ]
  
  return details;
}