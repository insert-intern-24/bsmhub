import {
  Profile,
  PortfolioCardProps,
} from '@/app/components/card/portfolio/types';
import { TeamData } from '@/app/(box-layout)/team/types';
import { convertFromDatabaseImageURL } from './supabase/imageHostConverter';

/**
 * 팀 데이터를 포트폴리오 카드 컴포넌트 props로 변환
 * @param team - 변환할 팀 데이터
 * @returns 포트폴리오 카드 컴포넌트에 전달할 props
 */
export function transformTeamToPortfolioCard(
  team: TeamData,
): PortfolioCardProps {
  const profile: Profile = {
    name: team.profile_name || '',
    role: ['Team'], // 팀은 role을 'Team'으로 표시
    bio: team.description || '',
    status: 'active', // 팀은 기본적으로 active 상태
    profile_image: team.profile_image
      ? convertFromDatabaseImageURL(team.profile_image)
      : '',
  };

  // 팀원들을 프로젝트 형태로 변환 (팀원 프로필 이미지를 표시하기 위해)
  const projects =
    team.team_member?.map((member, index) => ({
      title: `Member ${index + 1}`,
      description: '',
      logo: '',
      projectImage: member.profile.profile_image
        ? convertFromDatabaseImageURL(member.profile.profile_image)
        : '',
    })) ?? [];

  return {
    profile,
    projects,
  };
}
