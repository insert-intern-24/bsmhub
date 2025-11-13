import React from 'react';
import { Body2, Caption, Label } from '@/app/components/system/text';
import { Profile } from '@/app/components/card/portfolio/types';

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
    layout === 'vertical'
      ? 'flex-center flex-col gap-[0.25rem]'
      : 'flex-col gap-1';

  const RoleComponent = useLabel ? Label : Caption;

  return (
    <div className={containerClass}>
      <Body2>{profile.name}</Body2>
      <RoleComponent className="text-gray-base">
        {profile.role.length > 0
          ? `${profile.role.join(', ')} 희망`
          : '희망 분야 없음'}
      </RoleComponent>
      {showBio && <Caption className="text-gray-base">{profile.bio}</Caption>}
    </div>
  );
};

export default ProfileInfo;
