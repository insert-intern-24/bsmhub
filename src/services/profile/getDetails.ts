'use server';
import { createClient } from "@/utils/supabase/server";
import { Details } from '@models/collection'

const getDetails = async (profile_id: string): Promise<Details | null> => {
  const supabase = await createClient();

  const getSkills = async (profile_id: string) => {
    const { data, error } = await supabase
      .schema('profile')
      .from('v_profile_skills')
      .select('*')
      .eq('profile_id', profile_id)

    if (error) {
      console.error('스킬 조회 중 오류', error)
      return [];
    }

    return data || [];
  }

  const getLinks = async (profile_id: string) => {
    const { data, error } = await supabase
      .schema('profile')
      .from('profile_link')
      .select('*')
      .eq('profile_id', profile_id)

    if (error) {
      console.error('링크 조회 중 오류', error)
      return [];
    }
  
    return data || [];
  }

  const getCompetitions = async (profile_id: string) => {
    const { data, error } = await supabase
      .schema('profile')
      .from('v_profile_competitions')
      .select('*')
      .eq('profile_id', profile_id)

    if (error) {
      console.error('수상 이력 조회 중 오류', error)
      return [];
    }

    return data || [];
  }

  const getCertificates = async (profile_id: string) => {
    const { data, error } = await supabase
      .schema('profile')
      .from('v_profile_certificates')
      .select('*')
      .eq('profile_id', profile_id)

    if (error) {
      console.error('자격증 조회 중 오류')
      return [];
    }

    return data || [];
  }

  const [
    skill_Datas, 
    link_Datas, 
    competition_Datas,
    certificate_Datas,
  ] = await Promise.all([
    getSkills(profile_id),
    getLinks(profile_id),
    getCompetitions(profile_id),
    getCertificates(profile_id)
  ]);

  const Detail_Datas = {
    details: [
      {
        label: '링크',
        symbol: 'link',
        contents: 
          link_Datas.map(item => ({
            value: item.alt ?? null,
            address: item.link
          }))
      },
      {
        label: '자격증',
        symbol: 'license',
        contents:
          certificate_Datas.map(item => ({
            value: item.certificate_name ?? null,
            certified: false
          }))
      },
      {
        label: '수상이력',
        symbol: 'prize',
        contents:
          competition_Datas.map(item => ({
            value: `${item.competition_name ?? null} ${item.prize ?? null}`
          }))
      },
      {
        label: '기술스택',
        symbol: 'stack',
        contents:
          skill_Datas.map(item => ({
            value: item.skill_name ?? null
          }))
      }
    ]
  }

  return Detail_Datas
}

export default getDetails