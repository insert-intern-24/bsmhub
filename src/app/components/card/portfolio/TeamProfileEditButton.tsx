'use client';

import EditButton from './EditButton';
import { teamProfileConfig } from '@/services/config/teamProfileConfig';

interface TeamProfileEditButtonProps {
  profileId: string;
}

const TeamProfileEditButton = ({ profileId }: TeamProfileEditButtonProps) => {
  return (
    <EditButton
      config={teamProfileConfig}
      variables={{ profile_id: profileId }}
      mode="update"
      isTeam={true}
      gap={4}
    />
  );
};

export default TeamProfileEditButton;
