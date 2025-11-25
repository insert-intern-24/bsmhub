import { CardProps } from '@/app/components/card/project/ProjectCard';
import { TeamData } from '@/app/(box-layout)/team/types';
import { convertFromDatabaseImageURL } from '@/services/supabase/imageHostConverter';

/**
 * 팀 데이터를 카드 컴포넌트 props로 변환
 * @param team - 변환할 팀 데이터
 * @returns 카드 컴포넌트에 전달할 props
 */
export function transformTeamToCard(team: TeamData): CardProps {
  return {
    id: parseInt(team.profile_id, 10),
    title: team.profile_name || '',
    description: team.profile_name || '',
    projectImage: team.profile_image
      ? convertFromDatabaseImageURL(team.profile_image)
      : '',
    ownerName: team.profile_name,
    isTeam: true,
    category: 'Team',
    authors:
      team.team_member?.map((member) => ({
        name: undefined,
        profileImage: member.profile.profile_image
          ? convertFromDatabaseImageURL(member.profile.profile_image)
          : '',
      })) ?? [],
  };
}
