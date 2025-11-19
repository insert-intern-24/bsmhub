'use client';

import EditButton from './EditButton';
import { profileConfig } from '@/services/config/profileConfig';

interface ProfileEditButtonProps {
  ownerId: string;
}

const ProfileEditButton = ({ ownerId }: ProfileEditButtonProps) => {
  return (
    <EditButton
      config={profileConfig}
      variables={{ owner: ownerId }}
      ownerId={ownerId}
      isTeam={false}
      checkExistence={true}
      requireOwner={true}
    />
  );
};

export default ProfileEditButton;
