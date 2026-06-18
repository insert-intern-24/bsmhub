'use client';

import { useCallback, useEffect, useState } from 'react';
import Dropdown, { DropdownItem } from '@/app/components/ui/dropdown/Dropdown';
import { Label } from '@/app/components/ui/text/text';
import { useModal } from '@/app/components/modal';
import { useCurrentUser } from '@/utils/hook/useCurrentUser';
import { openProjectModal } from '@/utils/modal/openProjectModal';
import { openTeamModal } from '@/utils/modal/openTeamModal';
import { getProfileByStudentId } from '@/services/profile/getProfileApi.client';

const HeaderDropdown = () => {
  const currentUser = useCurrentUser();
  const { openModal, closeModal } = useModal();
  const [profileName, setProfileName] = useState<string | null>(null);

  const handleMakeProject = useCallback(() => {
    if (!currentUser?.id) return;
    void openProjectModal(currentUser.id, openModal, closeModal);
  }, [currentUser?.id, openModal, closeModal]);

  const handleMakeTeam = useCallback(() => {
    if (!currentUser?.id) return;
    void openTeamModal(currentUser.id, openModal, closeModal);
  }, [currentUser?.id, openModal, closeModal]);

  useEffect(() => {
    if (!currentUser?.id) return;
    let mounted = true;

    const init = async () => {
      const profile = await getProfileByStudentId(currentUser.id);

      if (!mounted) return;
      if (profile) {
        setProfileName(profile.profile_name);
      } else {
        setProfileName(null);
      }
    };
    void init();

    return () => {
      mounted = false;
    };
  }, [currentUser?.id]);

  if (!currentUser || !profileName) {
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
