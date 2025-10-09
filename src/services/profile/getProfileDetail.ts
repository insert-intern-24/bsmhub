'use server';
import { PortfolioDetailProps } from "@/app/portfolio/types/portfolio";
import { createClient } from "@/utils/supabase/server";

export const getProfileDetail = async (profile_id: string): Promise<PortfolioDetailProps[]> => {
  const supabase = await createClient();
  
  const getLinks = async () => {
    const { data, error } = await supabase
      .from('profile_link')
      .select('*')
      .eq('profile_id', profile_id)

    if (error) {
      console.error('스킬 조회 중 오류')
      return [];
    }

    return data || [];
  }

  const getCertificates = async () => {
    const { data, error } = await supabase
      .from('v_profile_certificates')
      .select('*')
      .eq('profile_id', profile_id)

    if (error) {
      console.error('자격증 조회 중 오류')
      return [];
    }

    return data || [];
  }

  const getCompetitions = async () => {
    const { data, error } = await supabase
      .from('v_profile_competitions')
      .select('*')
      .eq('profile_id', profile_id)

    if (error) {
      console.error('대회 조회 중 오류')
      return [];
    }

    return data || [];
  }
    
  const getSkills = async () => {
    const { data, error } = await supabase
      .from('v_profile_skills')
      .select('*')
      .eq('profile_id', profile_id)

    if (error) {
      console.error('스킬 조회 중 오류')
      return [];
    }

    return data || [];
  }

  const [links, certificates, competitions, skills] = await Promise.all([
    getLinks(),
    getCertificates(),
    getCompetitions(),
    getSkills()
  ]);

  const details: PortfolioDetailProps[] = [
    { 
      mode: 'link',
      datas: links.map(link => ({
        value: link.alt,
        url: link.link
      }))
    },
    {
      mode: 'certificate',
      datas: certificates.map(certificate => ({
        value: certificate.certificate_name
      }))
    },
    {
      mode: 'competition',
      datas: competitions.map(competition => ({
        value: competition.competition_name,
        prize: competition.prize
      }))
    },
    {
      mode: 'skill',
      datas: skills.map(skill => ({
        value: skill.skill_name
      }))
    }
  ]

  return details;
}