'use client';

import FormEditButton from './FormEditButton';
import { teamProfileConfig } from '@/services/config/teamProfileConfig';

interface TeamProfileEditButtonProps {
  profileId: string;
}

const TeamProfileEditButton = ({ profileId }: TeamProfileEditButtonProps) => {
  return (
    <FormEditButton
      config={teamProfileConfig}
      variables={{ profile_id: profileId }}
      mode="update"
      isTeam={true}
    />
  );
};

export default TeamProfileEditButton;

