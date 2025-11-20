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

  return (
    <div className={containerClass}>
      <div className="flex-center">
        <Body2>{profile.name}</Body2>
        <StatusBadge status={profile.status} />
      </div>
      <RoleComponent className="text-gray-base">
        {profile.role.length > 0
          ? `${profile.role.join(', ')} 희망`
          : '희망 분야 없음'}
      </RoleComponent>
      {showBio && (
        <Caption className="text-gray-base truncate">{profile.bio}</Caption>
      )}
    </div>
  );
};

export default ProfileInfo;
