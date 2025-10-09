'use server';
import { PortfolioDetailProps } from "@/app/portfolio/types/portfolio";
import { createClient } from "@/utils/supabase/server";
import { Database } from "@/utils/supabase/database.types";

type DatabaseType = Database['public']['Tables']

type LinkType = DatabaseType['profile_link']['Row'];

interface CertificateType {
  profile_id: string;
  certificate_id: number;
  certificate_name: string;
  is_software: boolean;
}

interface CompetitionType {
  profile_id: string;
  prize: string;
  competition_id: number;
  competition_name: string;
  competition_duration: string;
}

interface SkillType {
  profile_id: string;
  skill_id: number;
  skill_name: string;
  language: boolean;
}

export const getProfileDetail = async (profile_id: string): Promise<PortfolioDetailProps[]> => {
  const supabase = await createClient();
  
  const getLinks = async (): Promise<LinkType[]> => {
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

  const getCertificates = async (): Promise<CertificateType[]> => {
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

  const getCompetitions = async (): Promise<CompetitionType[]> => {
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
    
  const getSkills = async (): Promise<SkillType[]> => {
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
        value: link?.alt,
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