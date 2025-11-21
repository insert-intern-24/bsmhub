import {
  Profile,
  Project,
  PortfolioCardProps,
} from '@/app/components/card/portfolio/types';
import { TeamData } from '@/app/(box-layout)/team/types';
import { convertFromDatabaseImageURL } from '@/services/supabase/imageHostConverter';
import { getFoundedYear } from '@/utils/date';

/**
 * 팀 데이터를 포트폴리오 카드 컴포넌트 props로 변환
 * @param team - 변환할 팀 데이터
 * @returns 포트폴리오 카드 컴포넌트에 전달할 props
 */
export function transformTeamToPortfolioCard(
  team: TeamData,
): PortfolioCardProps {
  // is_official 값에 따라 role 결정
  const teamType = team.is_official ? '전공동아리' : '일반동아리';

  const profile: Profile = {
    name: team.profile_name || '',
    role: [teamType],
    bio: team.description || '',
    status: 'active', // 팀은 기본적으로 active 상태
    profile_image: team.profile_image
      ? convertFromDatabaseImageURL(team.profile_image)
      : '',
  };

  // 팀의 모든 프로젝트를 전달 (개수 제한은 PortfolioCard에서 처리)
  const projects: Project[] =
    team.projects?.map((project) => ({
      title: project.project_name,
      description: project.description || '',
      logo: '',
      projectImage: project.project_thumbnail
        ? convertFromDatabaseImageURL(project.project_thumbnail)
        : '',
    })) ?? [];

  return {
    profile,
    projects,
    isOfficial: team.is_official ?? false,
    createdAt: team.created_at,
  };
}
