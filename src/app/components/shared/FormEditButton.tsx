'use client';

import { IconPencil } from '@tabler/icons-react';
import { useCallback } from 'react';
import { useModal } from '@/app/components/modal';
import { useCurrentUser } from '@/utils/hook/useCurrentUser';
import RoundedButton from '@/app/components/shared/system/RoundedButton';
import ProfileEditModal from './ProfileEditModal';
import type { FormConfig } from '@/app/components/modal/inputs/types/inputTypes';
import { checkProfileExistence } from '@/services/profile/getProfileApi.client';

interface FormEditButtonProps {
  config: FormConfig;
  variables: Record<string, unknown>;
  mode?: 'create' | 'update';
  ownerId?: string;
  isTeam?: boolean;
  checkExistence?: boolean;
  requireOwner?: boolean;
  className?: string;
}

const FormEditButton = ({
  config,
  variables,
  mode,
  ownerId,
  isTeam = false,
  checkExistence = false,
  requireOwner = false,
  className,
}: FormEditButtonProps) => {
  const currentUser = useCurrentUser();
  const { openModal, closeModal } = useModal();

  // 권한 확인: requireOwner가 true면 소유자 확인
  const isOwner = requireOwner ? currentUser?.id === ownerId : true;

  const handleEdit = useCallback(async () => {
    let finalMode: 'create' | 'update' = mode || 'update';

    // checkExistence가 true면 프로필 존재 여부 확인
    if (checkExistence && ownerId) {
      const profileExists = await checkProfileExistence(ownerId);
      finalMode = profileExists ? 'update' : 'create';
    }

    openModal(
      <ProfileEditModal
        config={config}
        variables={variables}
        mode={finalMode}
        ownerId={ownerId}
        isTeam={isTeam}
        onClose={closeModal}
      />,
    );
  }, [config, variables, mode, ownerId, isTeam, checkExistence, openModal, closeModal]);

  // 로그인하지 않았거나 소유자가 아니면 버튼을 렌더링하지 않음
  if (!currentUser || (requireOwner && !isOwner)) {
    return null;
  }

  return (
    <RoundedButton
      onClick={handleEdit}
      className={className}
    >
      <IconPencil size={12} />
      Edit
    </RoundedButton>
  );
};

export default FormEditButton;

