import React from 'react';
import { Body2, Caption, Label } from '@/app/components/ui/text/text';
import { Profile } from '@/app/components/card/portfolio/types';
import StatusBadge from '../../badge/StatusBadge';

interface ProfileInfoProps {
  profile: Profile;
  layout?: 'vertical' | 'horizontal';
  showBio?: boolean;
  useLabel?: boolean;
}

const ProfileInfo = ({
  profile,
  layout = 'vertical',
  showBio = true,
  useLabel = false,
}: ProfileInfoProps) => {
  const containerClass =
    layout === 'vertical' ? 'flex-center flex-col' : 'flex-col gap-1';

  const RoleComponent = useLabel ? Label : Caption;

  const isTeamRole = profile.role.some(
    (role) => role === '전공동아리' || role === '일반동아리',
  );
  const roleText =
    profile.role.length > 0
      ? isTeamRole
        ? profile.role.join(', ')
        : `${profile.role.join(', ')} 희망`
      : '희망 분야 없음';

  // active 상태이고 팀 역할이면 StatusBadge에 role 표시
  const statusBadgeText =
    isTeamRole && profile.role.length > 0
      ? profile.role[0]
      : profile.status;

  return (
    <div className={`${containerClass} max-h-[8.25rem] overflow-hidden`}>
      <div className="flex-center">
        <Body2>{profile.name}</Body2>
        <StatusBadge status={statusBadgeText} />
      </div>
      {!isTeamRole && (
        <RoleComponent className="text-gray-base -mt-1">{roleText}</RoleComponent>
      )}
      {showBio && (
        <Caption className="!block text-gray-base break-words line-clamp-3">
          {profile.bio}
        </Caption>
      )}
    </div>
  );
};

export default ProfileInfo;
