'use client';

import { useCallback } from 'react';
import Dropdown, { DropdownItem } from '@/app/components/shared/dropdown/Dropdown';
import { Label } from '@/app/components/shared/system/text';
import { useModal } from '@/app/components/modal';
import { useCurrentUser } from '@/utils/hook/useCurrentUser';
import { openProjectModal } from '@/utils/modal/openProjectModal';
import { openTeamModal } from '@/utils/modal/openTeamModal';

const HeaderDropdown = () => {
  const currentUser = useCurrentUser();
  const { openModal, closeModal } = useModal();

  const handleMakeProject = useCallback(() => {
    if (!currentUser?.id) return;
    void openProjectModal(currentUser.id, openModal, closeModal);
  }, [currentUser?.id, openModal, closeModal]);

  const handleMakeTeam = useCallback(() => {
    if (!currentUser?.id) return;
    void openTeamModal(currentUser.id, openModal, closeModal);
  }, [currentUser?.id, openModal, closeModal]);

  if (!currentUser) {
    return null;
  }

  return (
    <Dropdown trigger={<Label>+ 만들기</Label>}>
      <DropdownItem onSelect={handleMakeProject}>프로젝트 만들기</DropdownItem>
      <DropdownItem onSelect={handleMakeTeam}>동아리 만들기</DropdownItem>
    </Dropdown>
  );
};

export default HeaderDropdown;
