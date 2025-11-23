'use client';

import { createClient } from '@/services/supabase/client';
import { useCallback, useEffect, useState } from 'react';
import { Dropdown, DropdownItem } from '@/app/components/ui/dropdown/Dropdown';
import { useModal } from '@/app/components/modal';
import { useCurrentUser } from '@/utils/hook/useCurrentUser';
import { openProfileModal } from '@/utils/modal/openProfileModal';
import { openGoogleLogin } from '@/utils/auth/googleLogin';
import {
  checkProfileExistence,
  getProfileByStudentId,
} from '@/services/profile/getProfileApi.client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Account = () => {
  const supabase = createClient();
  const currentUser = useCurrentUser();
  const [profileName, setProfileName] = useState<string | null>(null);
  const { openModal, closeModal } = useModal();
  const router = useRouter();

  const handleMakeProfile = useCallback(() => {
    if (!currentUser?.id) return;
    void openProfileModal(currentUser.id, openModal, closeModal);
  }, [currentUser?.id, openModal, closeModal]);

  useEffect(() => {
    if (!currentUser?.id) return;
    let mounted = true;

    const init = async () => {
      const [profile, exists] = await Promise.all([
        getProfileByStudentId(currentUser.id),
        checkProfileExistence(currentUser.id),
      ]);

      if (!mounted) return;
      if (profile) {
        setProfileName(profile.profile_name);
      } else {
        setProfileName(null);
      }
      if (!exists) handleMakeProfile();
    };
    void init();

    return () => {
      mounted = false;
    };
  }, [currentUser?.id, handleMakeProfile]);

  return currentUser ? (
    <Dropdown
      trigger={
        <Image
          src={currentUser?.user_metadata?.avatar_url ?? '/avatar.png'}
          alt="프로필"
          width={20}
          height={20}
          className="rounded-full cursor-pointer hover:opacity-80"
        />
      }
      align="right"
    >
      {profileName ? (
        <>
          <Link href={`/portfolio/${profileName}`}>
            <DropdownItem>내 프로필</DropdownItem>
          </Link>
          <Link href={`/team?profileName=${profileName}`}>
            <DropdownItem>내 동아리</DropdownItem>
          </Link>
          <Link href={`/project?profileName=${profileName}`}>
            <DropdownItem>내 프로젝트</DropdownItem>
          </Link>
        </>
      ) : (
        <DropdownItem onSelect={handleMakeProfile}>프로필 만들기</DropdownItem>
      )}
      <DropdownItem
        onSelect={async () => {
          await supabase.auth.signOut();
          router.refresh();
        }}
      >
        로그아웃
      </DropdownItem>
    </Dropdown>
  ) : (
    <button
      onClick={openGoogleLogin}
      className="px-2 py-1 bg-black text-caption text-white rounded-full transition-colors"
    >
      로그인
    </button>
  );
};

export default Account;
